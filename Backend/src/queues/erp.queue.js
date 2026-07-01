const { Queue } = require('bullmq');
const { getRedisConnectionOptions } = require('../config/redis');

const ERP_CHECKOUT_QUEUE = 'erp-checkout';

let erpQueue;

function getErpQueue() {
  if (!erpQueue) {
    erpQueue = new Queue(ERP_CHECKOUT_QUEUE, {
      connection: getRedisConnectionOptions(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    });
  }

  return erpQueue;
}

module.exports = {
  ERP_CHECKOUT_QUEUE,
  getErpQueue,
};
