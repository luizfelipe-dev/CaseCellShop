const checkoutService = require('../services/checkout.service');

async function checkout(req, res, next) {
  try {
    const result = await checkoutService.processCheckout(req.body);
    res.status(202).json({
      message: result.message,
      orderId: result.orderId,
      uid: result.uid,
      status: result.status,
    });
  } catch (error) {
    next(error);
  }
}

async function getOrderStatus(req, res, next) {
  try {
    const order = await checkoutService.getOrderByUid(req.params.uid);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkout,
  getOrderStatus,
};
