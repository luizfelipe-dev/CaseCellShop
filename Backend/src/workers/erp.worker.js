const { Worker } = require('bullmq');
const { getRedisConnectionOptions } = require('../config/redis');
const { ERP_CHECKOUT_QUEUE } = require('../queues/erp.queue');
const { ORDER_STATUS } = require('../models/Order');
const orderRepository = require('../repositories/order.repository');
const stockRepository = require('../repositories/stock.repository');
const erpSimulator = require('../services/erp.simulator');
const { invalidateProductsCache } = require('../services/product.service');
const { SERVER_ERROR_MESSAGE } = require('../utils/util');

let worker;

function startErpWorker() {
  if (worker) {
    return worker;
  }

  worker = new Worker(
    ERP_CHECKOUT_QUEUE,
    async (job) => {
      const { orderId, productId, amount } = job.data;

      await orderRepository.updateStatus(orderId, ORDER_STATUS.PROCESSING);

      try {
        await erpSimulator.processOrder();

        await orderRepository.updateStatus(orderId, ORDER_STATUS.COMPLETED, {
          message: 'Pedido processado com sucesso!.',
        });

        console.log(JSON.stringify({
          level: 'info',
          event: 'erp_order_completed',
          orderId,
          uid: job.data.uid,
          attempt: job.attemptsMade + 1,
          timestamp: new Date().toISOString(),
        }));
      } catch (error) {
        const isLastAttempt = job.attemptsMade + 1 >= (job.opts.attempts || 1);

        if (isLastAttempt) {
          await stockRepository.restoreStock(productId, amount);
          await invalidateProductsCache();

          await orderRepository.updateStatus(orderId, ORDER_STATUS.FAILED, {
            errorCode: 'server_error',
            message: SERVER_ERROR_MESSAGE,
          });

          console.error(JSON.stringify({
            level: 'error',
            event: 'erp_order_failed',
            orderId,
            uid: job.data.uid,
            attempt: job.attemptsMade + 1,
            error: error.message,
            timestamp: new Date().toISOString(),
          }));
        }

        throw error;
      }
    },
    {
      connection: getRedisConnectionOptions(),
    }
  );

  worker.on('failed', (job, error) => {
    console.error(JSON.stringify({
      level: 'error',
      event: 'erp_worker_job_failed',
      jobId: job?.id,
      uid: job?.data?.uid,
      error: error.message,
      timestamp: new Date().toISOString(),
    }));
  });

  return worker;
}

async function stopErpWorker() {
  if (worker) {
    await worker.close();
    worker = null;
  }
}

module.exports = {
  startErpWorker,
  stopErpWorker,
};
