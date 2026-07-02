require('dotenv').config();

const createApp = require('./app');
const Product = require('./models/Product');
const { connectDatabase } = require('./config/database');
const { createRedisClient } = require('./config/redis');
const runSeed = require('./seeds/runSeed');
const { startErpWorker } = require('./workers/erp.worker');

const PORT = process.env.PORT || 3001;

async function ensureSeedData() {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const count = await runSeed();
    console.log(JSON.stringify({
      level: 'info',
      event: 'seed_completed',
      products: count,
      timestamp: new Date().toISOString(),
    }));
  }
}

async function bootstrap() {
  await connectDatabase();
  await ensureSeedData();
  createRedisClient();
  startErpWorker();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(JSON.stringify({
      level: 'info',
      event: 'server_started',
      port: PORT,
      timestamp: new Date().toISOString(),
    }));
  });
}

bootstrap().catch((error) => {
  console.error(error.message || error);

  if (error.name === 'MongooseServerSelectionError') {
    console.error(
      'Não foi possível conectar ao MongoDB. Verifique se o serviço está rodando em',
      process.env.MONGO_URI || 'mongodb://localhost:27017/casecellshop'
    );
  }

  process.exit(1);
});
