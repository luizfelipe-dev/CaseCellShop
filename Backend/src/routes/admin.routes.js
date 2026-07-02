const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.post('/reset', adminController.reset);

module.exports = router;
