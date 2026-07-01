const mongoose = require('mongoose');

const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

const orderSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    amount: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    message: { type: String },
    errorCode: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = {
  Order,
  ORDER_STATUS,
};
