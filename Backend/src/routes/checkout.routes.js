const express = require('express');
const checkoutController = require('../controllers/checkout.controller');

const router = express.Router();

router.post('/', checkoutController.checkout);
router.get('/:uid', checkoutController.getOrderStatus);

module.exports = router;
