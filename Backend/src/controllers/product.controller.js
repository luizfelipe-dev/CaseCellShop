const productService = require('../services/product.service');

async function listProducts(_req, res, next) {
  try {
    const products = await productService.listProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function searchProduct(req, res, next) {
  try {
    const product = await productService.searchProduct(req.query.q || '');
    res.json(product);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  searchProduct,
};
