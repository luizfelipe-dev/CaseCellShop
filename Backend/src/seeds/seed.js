require('dotenv').config();

const { connectDatabase, disconnectDatabase } = require('../config/database');
const runSeed = require('./runSeed');

async function seed() {
  await connectDatabase();
  const count = await runSeed();
  console.log(`Seed concluído: ${count} produtos criados.`);
  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error('Erro ao executar seed:', error);
  await disconnectDatabase();
  process.exit(1);
});
