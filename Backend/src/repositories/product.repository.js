const Product = require('../models/Product');
const Stock = require('../models/Stock');
const { toIdString } = require('../utils/util');

async function findAllWithStock() {
  const products = await Product.find({ active: true }).lean();
  const stocks = await Stock.find({
    productId: { $in: products.map((product) => product._id) },
  }).lean();

  const stockByProductId = new Map(
    stocks.map((stock) => [toIdString(stock.productId), stock.quantity])
  );

  return products.map((product) => ({
    id: toIdString(product._id),
    name: product.name,
    price: product.price,
    description: product.description,
    imageUrl: product.imageUrl || '',
    stock: stockByProductId.get(toIdString(product._id)) ?? 0,
  }));
}

async function findById(productId) {
  return Product.findById(productId).lean();
}

module.exports = {
  findAllWithStock,
  findById,
};
