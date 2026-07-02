const AppError = require('../utils/AppError');

function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorCode: err.errorCode,
      message: err.message,
    });
  }

  console.error(JSON.stringify({
    level: 'error',
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  }));

  return res.status(500).json({
    errorCode: 'server_error',
    message: 'Estamos com uma instabilidade temporária. Tente novamente mais tarde.',
  });
}

module.exports = errorHandler;
