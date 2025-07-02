const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },              // e.g., "Music Concert"
  date: { type: Date, required: true },                // Event date
  location: { type: String, required: true },          // Event location
  description: { type: String, required: true },       // Event description
  capacity: { type: Number, required: true },
  ticketType: { type: String, required: true },        // e.g., "VIP", "General"
  ticketPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },           // Whether event requires payment
  bookedUsers: [{ type: String }],                     // list of usernames
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
