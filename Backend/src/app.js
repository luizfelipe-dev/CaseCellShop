const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/product.routes');
const checkoutRoutes = require('./routes/checkout.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middlewares/errorHandler');

function createApp() {
  const app = express();

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
  ].filter(Boolean);

  app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/products', productRoutes);
  app.use('/checkout', checkoutRoutes);
  app.use('/orders', orderRoutes);
  app.use('/admin', adminRoutes);

  app.use(errorHandler);

  return app;
}

module.exports = createApp;
