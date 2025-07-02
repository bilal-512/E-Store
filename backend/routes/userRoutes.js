const express = require('express');
const router = express.Router();
const { getUserProfile, requestBalance, getBalanceRequestHistory } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, getUserProfile);
router.post('/balance-request', authenticateToken, requestBalance);
router.get('/balance-request/history', authenticateToken, getBalanceRequestHistory);

module.exports = router;