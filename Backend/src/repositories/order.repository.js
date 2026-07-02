const { Order } = require('../models/Order');

async function findByUid(uid) {
  return Order.findOne({ uid }).lean();
}

async function findAll() {
  return Order.find().sort({ createdAt: -1 }).lean();
}

async function create(orderData) {
  return Order.create(orderData);
}

async function updateStatus(orderId, status, extra = {}) {
  return Order.findByIdAndUpdate(
    orderId,
    { status, ...extra },
    { new: true }
  ).lean();
}

module.exports = {
  findByUid,
  findAll,
  create,
  updateStatus,
};
