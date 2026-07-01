const productService = require('../services/product.service');

async function listProducts(_req, res, next) {
  try {
    const products = await productService.listProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
};
