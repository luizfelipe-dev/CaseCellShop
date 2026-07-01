require('../setup');

const request = require('supertest');
const createApp = require('../../src/app');
const {
  setupTestDatabase,
  teardownTestDatabase,
  clearDatabase,
} = require('../helpers/database');
const { seedTestProducts } = require('../helpers/seed');
const { clearMocks } = require('../setup');

const app = createApp();

describe('GET /products', () => {
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

  it('lista produtos com estoque', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toMatchObject({
      name: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
    });
  });
});
