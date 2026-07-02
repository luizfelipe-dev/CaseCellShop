const Product = require('../models/Product');
const Stock = require('../models/Stock');
const { Order } = require('../models/Order');
const productsSeed = require('./productsSeed');

async function runSeed() {
  await Order.deleteMany({});
  await Stock.deleteMany({});
  await Product.deleteMany({});

  for (const item of productsSeed) {
    const { stock, ...productData } = item;
    const product = await Product.create(productData);
    await Stock.create({
      productId: product._id,
      quantity: stock,
    });
  }

  return productsSeed.length;
}

module.exports = runSeed;
