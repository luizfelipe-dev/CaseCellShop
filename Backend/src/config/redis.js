const Redis = require('ioredis');

let redisClient;

function createRedisClient(url = process.env.REDIS_URL || 'redis://localhost:6379') {
  if (!redisClient) {
    redisClient = new Redis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  return redisClient;
}

function getRedisConnectionOptions(url = process.env.REDIS_URL || 'redis://localhost:6379') {
  const parsed = new URL(url);

  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
    maxRetriesPerRequest: null,
  };
}

async function disconnectRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

module.exports = {
  createRedisClient,
  getRedisConnectionOptions,
  disconnectRedis,
};
