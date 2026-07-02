const adminService = require('../services/admin.service');

async function reset(_req, res, next) {
  try {
    const result = await adminService.resetDatabase();
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  reset,
};
