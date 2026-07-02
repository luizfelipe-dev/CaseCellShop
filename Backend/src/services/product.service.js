const AppError = require('../errors/AppError');
const productRepository = require('../repositories/product.repository');
const { createRedisClient } = require('../config/redis');
const {
  PRODUCTS_CACHE_KEY,
  getProductsCacheTtl,
} = require('../constants/cache');

async function listProducts() {
  const redis = createRedisClient();
  const cached = await redis.get(PRODUCTS_CACHE_KEY);

  if (cached) {
    return JSON.parse(cached);
  }

  const products = await productRepository.findAllWithStock();

  await redis.set(
    PRODUCTS_CACHE_KEY,
    JSON.stringify(products),
    'EX',
    getProductsCacheTtl(),
    'NX'
  );

  return products;
}

async function invalidateProductsCache() {
  const redis = createRedisClient();
  await redis.del(PRODUCTS_CACHE_KEY);
}

async function searchProduct(term) {
  const results = await productRepository.searchByTerm(term);

  if (!results.length) {
    throw new AppError(404, 'not_found', 'Nenhum produto encontrado para esta busca.');
  }

  return {
    query: term.trim(),
    results,
    bestMatch: results[0],
  };
}

module.exports = {
  listProducts,
  invalidateProductsCache,
  searchProduct,
};
