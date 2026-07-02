const PRODUCTS_CACHE_KEY = 'products:list';

function getProductsCacheTtl() {
  return Number(process.env.PRODUCTS_CACHE_TTL) || 60;
}

module.exports = {
  PRODUCTS_CACHE_KEY,
  getProductsCacheTtl,
};
