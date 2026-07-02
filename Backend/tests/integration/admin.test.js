require('../setup');

const request = require('supertest');
const { randomUUID } = require('crypto');
const createApp = require('../../src/app');
const {
  setupTestDatabase,
  teardownTestDatabase,
  clearDatabase,
} = require('../helpers/database');
const { seedTestProducts } = require('../helpers/seed');
const { clearMocks } = require('../setup');

const app = createApp();

describe('GET /products/search', () => {
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

  it('encontra produto por ID', async () => {
    const product = products[0];
    const response = await request(app).get(`/products/search?q=${product._id}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toHaveLength(1);
    expect(response.body.results[0].id).toBe(product._id.toString());
    expect(response.body.results[0].name).toBe('Produto A');
    expect(response.body.bestMatch.id).toBe(product._id.toString());
  });

  it('encontra produto por nome parcial com ranking', async () => {
    const response = await request(app).get('/products/search?q=Produto B');

    expect(response.status).toBe(200);
    expect(response.body.results[0].name).toBe('Produto B');
    expect(response.body.results[0].score).toBeGreaterThan(0);
  });

  it('encontra produtos por palavras relacionadas', async () => {
    const response = await request(app).get('/products/search?q=produto');

    expect(response.status).toBe(200);
    expect(response.body.results.length).toBeGreaterThan(0);
  });

  it('retorna 404 quando não encontra', async () => {
    const response = await request(app).get('/products/search?q=inexistente');

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe('not_found');
  });
});

describe('GET /orders', () => {
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

  it('lista pedidos com nome do produto', async () => {
    await request(app).post('/checkout').send({
      uid: randomUUID(),
      productId: products[0]._id.toString(),
      amount: 1,
    });

    const response = await request(app).get('/orders');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].productName).toBe('Produto A');
    expect(response.body[0].status).toBe('pending');
  });
});

describe('POST /admin/reset', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    clearMocks();
    await clearDatabase();
    await seedTestProducts();
  });

  it('reseta banco e recria produtos do seed', async () => {
    const response = await request(app).post('/admin/reset');

    expect(response.status).toBe(200);
    expect(response.body.productsCreated).toBe(8);

    const productsResponse = await request(app).get('/products');
    expect(productsResponse.body).toHaveLength(8);
  });
});
