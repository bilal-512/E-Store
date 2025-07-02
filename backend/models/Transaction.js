const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['event_booking', 'bill_payment', 'store_purchase', 'balance_added'], 
    required: true 
  },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Event ID, Bill ID, etc.
  balanceBefore: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['completed', 'failed', 'pending'], 
    default: 'completed' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema); 