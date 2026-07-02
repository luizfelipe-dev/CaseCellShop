const runSeed = require('../seeds/runSeed');
const { invalidateProductsCache } = require('./product.service');

async function resetDatabase() {
  const productsCreated = await runSeed();
  await invalidateProductsCache();

  return {
    message: 'Banco resetado e estoque atualizado com sucesso.',
    productsCreated,
  };
}

module.exports = {
  resetDatabase,
};
