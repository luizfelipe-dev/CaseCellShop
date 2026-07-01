const store = new Map();

const mockRedis = {
  get: jest.fn(async (key) => (store.has(key) ? store.get(key) : null)),
  set: jest.fn(async (key, value) => {
    store.set(key, value);
  }),
  del: jest.fn(async (key) => {
    store.delete(key);
  }),
  quit: jest.fn(async () => {}),
};

const mockQueue = {
  add: jest.fn().mockResolvedValue({ id: 'job-test-1' }),
};

jest.mock('../src/config/redis', () => ({
  createRedisClient: () => mockRedis,
  getRedisConnectionOptions: () => ({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null,
  }),
  disconnectRedis: jest.fn(),
}));

jest.mock('../src/queues/erp.queue', () => ({
  ERP_CHECKOUT_QUEUE: 'erp-checkout',
  getErpQueue: () => mockQueue,
}));

function clearMocks() {
  store.clear();
  mockRedis.get.mockClear();
  mockRedis.set.mockClear();
  mockRedis.del.mockClear();
  mockQueue.add.mockClear();
  mockQueue.add.mockResolvedValue({ id: 'job-test-1' });
}

module.exports = {
  mockQueue,
  clearMocks,
};
