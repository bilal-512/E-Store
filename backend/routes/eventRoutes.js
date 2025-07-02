const express = require('express');
const router = express.Router();
const { getEvents, bookEvent, createEvent, getUserTransactions, updateEvent, deleteEvent } = require('../controllers/eventController');
const authenticateToken = require('../middleware/authMiddleware');

// GET all events
router.get('/', getEvents);

// GET user transactions
router.get('/transactions', authenticateToken, getUserTransactions);

// POST to create a new event (admin)
router.post('/', authenticateToken, createEvent);

// PUT to update an event (admin)
router.put('/:eventId', authenticateToken, updateEvent);

// DELETE to delete an event (admin)
router.delete('/:eventId', authenticateToken, deleteEvent);

// POST to book a ticket
router.post('/:eventId/book', authenticateToken, bookEvent);

module.exports = router;
