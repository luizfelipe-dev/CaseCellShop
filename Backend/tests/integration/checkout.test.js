require('../setup');

const request = require('supertest');
const { randomUUID } = require('crypto');
const createApp = require('../../src/app');
const Stock = require('../../src/models/Stock');
const {
  setupTestDatabase,
  teardownTestDatabase,
  clearDatabase,
} = require('../helpers/database');
const { seedTestProducts } = require('../helpers/seed');
const { clearMocks, mockQueue } = require('../setup');

const app = createApp();

describe('POST /checkout', () => {
  let products;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    clearMocks();
    await clearDatabase();
    products = await seedTestProducts();
  });

  it('retorna 202 em checkout com sucesso', async () => {
    const product = products[0];

    const response = await request(app).post('/checkout').send({
      uid: randomUUID(),
      productId: product._id.toString(),
      amount: 2,
    });

    expect(response.status).toBe(202);
    expect(response.body.message).toBe(
      'O pedido foi recebido com sucesso e será processado'
    );
    expect(response.body.orderId).toBeDefined();
    expect(mockQueue.add).toHaveBeenCalledTimes(1);
  });

  it('decrementa o estoque pela quantidade comprada', async () => {
    const product = products[0];

    const response = await request(app).post('/checkout').send({
      uid: randomUUID(),
      productId: product._id.toString(),
      amount: 3,
    });

    expect(response.status).toBe(202);

    const stock = await Stock.findOne({ productId: product._id });
    expect(stock.quantity).toBe(7);
  });

  it('retorna 400 para payload inválido', async () => {
    const response = await request(app).post('/checkout').send({
      uid: 'invalido',
      productId: '123',
      amount: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('user_request_error');
  });

  it('retorna 400 quando estoque é insuficiente', async () => {
    const product = products[2];

    const response = await request(app).post('/checkout').send({
      uid: randomUUID(),
      productId: product._id.toString(),
      amount: 1,
    });

    expect(response.status).toBe(400);
    expect(response.body.errorCode).toBe('stock_error');
  });

  it('é idempotente para o mesmo uid', async () => {
    const product = products[0];
    const uid = randomUUID();
    const payload = {
      uid,
      productId: product._id.toString(),
      amount: 1,
    };

    const first = await request(app).post('/checkout').send(payload);
    const second = await request(app).post('/checkout').send(payload);

    expect(first.status).toBe(202);
    expect(second.status).toBe(202);
    expect(first.body.orderId).toBe(second.body.orderId);

    const stock = await Stock.findOne({ productId: product._id });
    expect(stock.quantity).toBe(9);
    expect(mockQueue.add).toHaveBeenCalledTimes(1);
  });

  it('evita overselling em requisições concorrentes', async () => {
    const product = products[1];
    const payloadA = {
      uid: randomUUID(),
      productId: product._id.toString(),
      amount: 1,
    };
    const payloadB = {
      uid: randomUUID(),
      productId: product._id.toString(),
      amount: 1,
    };

    const [responseA, responseB] = await Promise.all([
      request(app).post('/checkout').send(payloadA),
      request(app).post('/checkout').send(payloadB),
    ]);

    const statuses = [responseA.status, responseB.status].sort();
    expect(statuses).toEqual([202, 400]);

    const stock = await Stock.findOne({ productId: product._id });
    expect(stock.quantity).toBe(0);
  });

  it('retorna 503 quando a fila está indisponível', async () => {
    mockQueue.add.mockRejectedValueOnce(new Error('Redis down'));
    const product = products[0];

    const response = await request(app).post('/checkout').send({
      uid: randomUUID(),
      productId: product._id.toString(),
      amount: 1,
    });

    expect(response.status).toBe(503);
    expect(response.body.errorCode).toBe('server_error');

    const stock = await Stock.findOne({ productId: product._id });
    expect(stock.quantity).toBe(10);
  });
});

describe('GET /orders/:uid', () => {
  let products;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    clearMocks();
    await clearDatabase();
    products = await seedTestProducts();
  });

  it('retorna status do pedido', async () => {
    const uid = randomUUID();

    const checkoutResponse = await request(app).post('/checkout').send({
      uid,
      productId: products[0]._id.toString(),
      amount: 1,
    });

    const response = await request(app).get(`/orders/${uid}`);

    expect(response.status).toBe(200);
    expect(response.body.uid).toBe(uid);
    expect(response.body.orderId).toBe(checkoutResponse.body.orderId);
    expect(response.body.status).toBe('pending');
  });
});
