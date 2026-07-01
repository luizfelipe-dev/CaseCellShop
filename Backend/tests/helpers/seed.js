const Product = require('../../src/models/Product');
const Stock = require('../../src/models/Stock');

async function seedTestProducts() {
  const products = [];

  const items = [
    { name: 'Produto A', price: 10, description: 'Teste A', stock: 10 },
    { name: 'Produto B', price: 20, description: 'Teste B', stock: 1 },
    { name: 'Produto C', price: 30, description: 'Teste C', stock: 0 },
  ];

  for (const item of items) {
    const { stock, ...productData } = item;
    const product = await Product.create(productData);
    await Stock.create({ productId: product._id, quantity: stock });
    products.push({ ...product.toObject(), stock });
  }

  return products;
}

module.exports = {
  seedTestProducts,
};
