function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomDelay() {
  const min = Number(process.env.ERP_MIN_DELAY_MS) || 2000;
  const max = Number(process.env.ERP_MAX_DELAY_MS) || 4000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shouldFail() {
  const failureRate = Number(process.env.ERP_FAILURE_RATE) || 0.25;
  return Math.random() < failureRate;
}

async function processOrder() {
  const delay = getRandomDelay();
  await sleep(delay);

  if (shouldFail()) {
    const error = new Error('ERP temporariamente indisponível');
    error.code = 'ERP_UNAVAILABLE';
    throw error;
  }

  return {
    processedAt: new Date().toISOString(),
    delayMs: delay,
  };
}

module.exports = {
  processOrder,
};
