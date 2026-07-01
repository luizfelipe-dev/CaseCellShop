require('dotenv').config();

const mongoose = require('mongoose');

const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/casecellshop';

function getMongoUri() {
  return process.env.MONGO_URI || DEFAULT_MONGO_URI;
}

async function connectDatabase(uri = getMongoUri()) {
  if (!uri) {
    throw new Error(
      'MONGO_URI não definida. Copie .env.example para .env ou defina a variável de ambiente.'
    );
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
