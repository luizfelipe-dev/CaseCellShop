const Stock = require('../models/Stock');

async function findByProductId(productId) {
  return Stock.findOne({ productId }).lean();
}

async function reserveStock(productId, amount) {
  return Stock.findOneAndUpdate(
    {
      productId,
      quantity: { $gte: amount },
    },
    {
      $inc: { quantity: -amount },
    },
    { new: true }
  );
}

async function restoreStock(productId, amount) {
  return Stock.findOneAndUpdate(
    { productId },
    { $inc: { quantity: amount } },
    { new: true }
  );
}

module.exports = {
  findByProductId,
  reserveStock,
  restoreStock,
};
