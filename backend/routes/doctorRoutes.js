const express = require('express');
const router = express.Router();
const { getDoctors } = require('../controllers/doctorController');
const { bookAppointment } = require('../controllers/appointmentController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', getDoctors);
router.post('/appointments', authenticateToken, bookAppointment);

module.exports = router;