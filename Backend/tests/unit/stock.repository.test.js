const stockRepository = require('../../src/repositories/stock.repository');
const Product = require('../../src/models/Product');
const Stock = require('../../src/models/Stock');
const {
  setupTestDatabase,
  teardownTestDatabase,
  clearDatabase,
} = require('../helpers/database');

describe('stock.repository', () => {
  let productId;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    const product = await Product.create({
      name: 'Capinha Teste',
      price: 50,
      description: 'Teste',
    });
    productId = product._id;
    await Stock.create({ productId, quantity: 5 });
  });

  it('reserva estoque de forma atômica', async () => {
    const updated = await stockRepository.reserveStock(productId, 2);
    expect(updated.quantity).toBe(3);

    const stock = await Stock.findOne({ productId });
    expect(stock.quantity).toBe(3);
  });

  it('rejeita reserva quando estoque é insuficiente', async () => {
    const updated = await stockRepository.reserveStock(productId, 10);
    expect(updated).toBeNull();

    const stock = await Stock.findOne({ productId });
    expect(stock.quantity).toBe(5);
  });

  it('restaura estoque após falha', async () => {
    await stockRepository.reserveStock(productId, 2);
    const restored = await stockRepository.restoreStock(productId, 2);
    expect(restored.quantity).toBe(5);
  });
});
