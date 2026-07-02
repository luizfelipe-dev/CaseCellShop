const mongoose = require('mongoose');
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const { toIdString } = require('../utils/util');
const { rankByVectorSimilarity } = require('../utils/textSearch');

function formatProduct(product, stock) {
  return {
    id: toIdString(product._id),
    name: product.name,
    price: product.price,
    description: product.description,
    imageUrl: product.imageUrl || '',
    stock: stock ?? 0,
  };
}

async function findAllWithStock() {
  const products = await Product.find({ active: true }).lean();
  const stocks = await Stock.find({
    productId: { $in: products.map((product) => product._id) },
  }).lean();

  const stockByProductId = new Map(
    stocks.map((stock) => [toIdString(stock.productId), stock.quantity])
  );

  return products.map((product) =>
    formatProduct(product, stockByProductId.get(toIdString(product._id)) ?? 0)
  );
}

async function findById(productId) {
  return Product.findById(productId).lean();
}

async function findByIdWithStock(productId) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return null;
  }

  const product = await Product.findOne({ _id: productId, active: true }).lean();
  if (!product) {
    return null;
  }

  const stock = await Stock.findOne({ productId: product._id }).lean();
  return formatProduct(product, stock?.quantity ?? 0);
}

async function searchByTerm(term) {
  const query = term.trim();
  if (!query) {
    return [];
  }

  if (mongoose.Types.ObjectId.isValid(query)) {
    const product = await findByIdWithStock(query);
    return product ? [{ ...product, score: 1 }] : [];
  }

  const products = await Product.find({ active: true }).lean();
  const stocks = await Stock.find({
    productId: { $in: products.map((product) => product._id) },
  }).lean();

  const stockByProductId = new Map(
    stocks.map((stock) => [toIdString(stock.productId), stock.quantity])
  );

  const catalog = products.map((product) =>
    formatProduct(product, stockByProductId.get(toIdString(product._id)) ?? 0)
  );

  const ranked = rankByVectorSimilarity(query, catalog, {
    textSelector: (product) => `${product.name} ${product.description}`,
    minScore: 0.12,
    limit: 5,
  });

  return ranked.map(({ item, score }) => ({
    ...item,
    score,
  }));
}

module.exports = {
  findAllWithStock,
  findById,
  findByIdWithStock,
  searchByTerm,
  formatProduct,
};
