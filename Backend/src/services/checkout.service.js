const AppError = require('../errors/AppError');
const { validateCheckout } = require('../schemas/checkout.schema');
const { ORDER_STATUS } = require('../models/Order');
const productRepository = require('../repositories/product.repository');
const stockRepository = require('../repositories/stock.repository');
const orderRepository = require('../repositories/order.repository');
const { getErpQueue } = require('../queues/erp.queue');
const { invalidateProductsCache } = require('./product.service');
const {
  CHECKOUT_SUCCESS_MESSAGE,
  SERVER_ERROR_MESSAGE,
  toIdString,
  buildCheckoutSuccessResponse,
} = require('../utils/util');

async function processCheckout(payload) {
  const { error, value } = validateCheckout(payload);

  if (error) {
    throw new AppError(400, 'user_request_error', 'Dados inválidos.');
  }

  const { uid, productId, amount } = value;

  const existingOrder = await orderRepository.findByUid(uid);
  if (existingOrder) {
    return buildCheckoutSuccessResponse(existingOrder);
  }

  const product = await productRepository.findById(productId);
  if (!product || !product.active) {
    throw new AppError(400, 'user_request_error', 'Dados inválidos.');
  }

  const reservedStock = await stockRepository.reserveStock(productId, amount);
  if (!reservedStock) {
    throw new AppError(400, 'stock_error', 'Não há mais itens disponíveis.');
  }

  let order;

  try {
    order = await orderRepository.create({
      uid,
      productId,
      amount,
      status: ORDER_STATUS.PENDING,
      message: CHECKOUT_SUCCESS_MESSAGE,
    });
  } catch (createError) {
    await stockRepository.restoreStock(productId, amount);

    if (createError.code === 11000) {
      const duplicateOrder = await orderRepository.findByUid(uid);
      if (duplicateOrder) {
        return buildCheckoutSuccessResponse(duplicateOrder);
      }
    }

    throw createError;
  }

  try {
    const queue = getErpQueue();
    await queue.add('process-checkout', {
      orderId: toIdString(order._id),
      uid: order.uid,
      productId: toIdString(order.productId),
      amount: order.amount,
    });
  } catch (queueError) {
    await stockRepository.restoreStock(productId, amount);
    await orderRepository.updateStatus(order._id, ORDER_STATUS.FAILED, {
      errorCode: 'server_error',
      message: SERVER_ERROR_MESSAGE,
    });

    throw new AppError(503, 'server_error', SERVER_ERROR_MESSAGE);
  }

  await invalidateProductsCache();

  return buildCheckoutSuccessResponse(order);
}

async function getOrderByUid(uid) {
  const order = await orderRepository.findByUid(uid);

  if (!order) {
    throw new AppError(404, 'not_found', 'Pedido não encontrado.');
  }

  return formatOrder(order);
}

async function listOrders() {
  const orders = await orderRepository.findAll();
  const productIds = [...new Set(orders.map((order) => toIdString(order.productId)))];

  const products = await Promise.all(
    productIds.map((id) => productRepository.findById(id))
  );

  const productNameById = new Map(
    products
      .filter(Boolean)
      .map((product) => [toIdString(product._id), product.name])
  );

  return orders.map((order) => ({
    ...formatOrder(order),
    productName: productNameById.get(toIdString(order.productId)) || 'Produto removido',
  }));
}

function formatOrder(order) {
  return {
    uid: order.uid,
    orderId: toIdString(order._id),
    productId: toIdString(order.productId),
    amount: order.amount,
    status: order.status,
    message: order.message,
    errorCode: order.errorCode,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

module.exports = {
  processCheckout,
  getOrderByUid,
  listOrders,
};
