const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { connectDatabase, disconnectDatabase } = require('../../src/config/database');

let mongoServer;

async function setupTestDatabase() {
  process.env.MONGOMS_DOWNLOAD_DIR = path.join(__dirname, '..', '.cache', 'mongodb-binaries');

  mongoServer = await MongoMemoryServer.create();
  await connectDatabase(mongoServer.getUri());
}

async function teardownTestDatabase() {
  await disconnectDatabase();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
}

module.exports = {
  setupTestDatabase,
  teardownTestDatabase,
  clearDatabase,
};
