const express = require('express');
const checkoutController = require('../controllers/checkout.controller');

const router = express.Router();

router.get('/', checkoutController.listOrders);
router.get('/:uid', checkoutController.getOrderStatus);

module.exports = router;
