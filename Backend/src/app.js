const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/product.routes');
const checkoutRoutes = require('./routes/checkout.routes');
const errorHandler = require('./middlewares/errorHandler');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/products', productRoutes);
  app.use('/checkout', checkoutRoutes);
  app.use('/orders', checkoutRoutes);

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
