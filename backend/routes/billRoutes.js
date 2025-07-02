const express = require('express');
const router = express.Router();
const { generateOrFetchBills, payBill } = require('../controllers/billController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, generateOrFetchBills);
router.post('/:id/pay', authenticateToken, payBill);

module.exports = router;