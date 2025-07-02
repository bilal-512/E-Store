const Event = require('../models/Event');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Book an event ticket
const bookEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { username } = req.user;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already booked
    if (event.bookedUsers.includes(username)) {
      return res.status(400).json({ message: 'You are already booked for this event' });
    }

    // Check if event has capacity
    if (event.bookedUsers.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    // Get user details
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if event is paid and handle balance deduction
    if (event.ticketPrice > 0) {
      // Check if user has sufficient balance
      if (user.balance < event.ticketPrice) {
        return res.status(400).json({ 
          message: 'Insufficient balance', 
          requiredAmount: event.ticketPrice,
          currentBalance: user.balance
        });
      }

      // Deduct balance from user account
      const balanceBefore = user.balance;
      user.balance -= event.ticketPrice;
      await user.save();

      // Create transaction record
      const transaction = new Transaction({
        userId: user._id,
        username: user.username,
        type: 'event_booking',
        amount: event.ticketPrice,
        description: `Event booking: ${event.name} - ${event.ticketType} ticket`,
        relatedId: event._id,
        balanceBefore: balanceBefore,
        balanceAfter: user.balance,
        status: 'completed'
      });
      await transaction.save();
    }

    // Add user to booked users
    event.bookedUsers.push(username);
    await event.save();

    res.json({ 
      message: 'Event booked successfully',
      event: event,
      balanceDeducted: event.ticketPrice > 0 ? event.ticketPrice : 0,
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new event (for admin use)
const createEvent = async (req, res) => {
  try {
    const { name, date, location, description, capacity, ticketType, ticketPrice } = req.body;
    
    // Determine if event is paid based on ticket price
    const isPaid = ticketPrice > 0;
    
    const event = new Event({
      name,
      date,
      location,
      description,
      capacity,
      ticketType,
      ticketPrice,
      isPaid,
      bookedUsers: []
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user transactions
const getUserTransactions = async (req, res) => {
  try {
    const { username } = req.user;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 transactions

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an event (for admin use)
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, date, location, description, capacity, ticketType, ticketPrice } = req.body;
    
    // Determine if event is paid based on ticket price
    const isPaid = ticketPrice > 0;
    
    const event = await Event.findByIdAndUpdate(eventId, {
      name,
      date,
      location,
      description,
      capacity,
      ticketType,
      ticketPrice,
      isPaid
    }, { new: true });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an event (for admin use)
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getEvents, bookEvent, createEvent, getUserTransactions, updateEvent, deleteEvent }; 