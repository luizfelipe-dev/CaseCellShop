require('dotenv').config();

const Product = require('../models/Product');
const Stock = require('../models/Stock');
const { connectDatabase, disconnectDatabase } = require('../config/database');

const productsSeed = [
  {
    name: 'Capinha Silicone iPhone 15',
    price: 49.9,
    description: 'Proteção flexível com acabamento fosco.',
    stock: 25,
  },
  {
    name: 'Capinha Transparente Galaxy S24',
    price: 39.9,
    description: 'Transparente anti-amarelamento.',
    stock: 18,
  },
  {
    name: 'Capinha Armor Xiaomi 14',
    price: 59.9,
    description: 'Bordas reforçadas para quedas.',
    stock: 12,
  },
  {
    name: 'Capinha MagSafe iPhone 14',
    price: 79.9,
    description: 'Compatível com carregamento magnético.',
    stock: 1,
  },
  {
    name: 'Capinha Couro Motorola Edge 40',
    price: 69.9,
    description: 'Estilo premium com boa aderência.',
    stock: 8,
  },
  {
    name: 'Capinha Kids Cartoon',
    price: 34.9,
    description: 'Estampas divertidas para o público infantil.',
    stock: 30,
  },
  {
    name: 'Capinha Slim OnePlus 12',
    price: 44.9,
    description: 'Ultra fina sem perder proteção.',
    stock: 15,
  },
  {
    name: 'Capinha Eco Reciclada',
    price: 54.9,
    description: 'Material reciclado e sustentável.',
    stock: 10,
  },
];

async function seed() {
  await connectDatabase();

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

  console.log(`Seed concluído: ${productsSeed.length} produtos criados.`);
  await disconnectDatabase();
}

seed().catch(async (error) => {
  console.error('Erro ao executar seed:', error);
  await disconnectDatabase();
  process.exit(1);
});
