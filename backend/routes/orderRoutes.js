const express = require('express');
const router = express.Router();
const { placeOrder } = require('../controllers/orderController');
const authenticateToken = require('../middleware/authMiddleware');

// POST a new order
router.post('/', authenticateToken, placeOrder);

module.exports = router;
