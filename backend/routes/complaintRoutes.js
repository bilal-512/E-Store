const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints } = require('../controllers/complaintController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, createComplaint);
router.get('/', authenticateToken, getComplaints);

module.exports = router;