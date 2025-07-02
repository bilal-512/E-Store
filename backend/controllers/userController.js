const User = require('../models/User');
const BalanceRequest = require('../models/BalanceRequest');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Request balance from admin
exports.requestBalance = async (req, res) => {
  try {
    console.log('Balance request received:', req.body);
    console.log('User ID from token:', req.user);
    
    const { requestedAmount, reason } = req.body;
    
    if (!requestedAmount || requestedAmount <= 0) {
      console.log('Invalid amount:', requestedAmount);
      return res.status(400).json({ message: 'Please provide a valid amount' });
    }
    
    if (!reason || reason.trim().length === 0) {
      console.log('Missing reason');
      return res.status(400).json({ message: 'Please provide a reason for the request' });
    }

    console.log('Looking for user with ID:', req.user.userId);
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found for ID:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user.username);

    // Check if user already has a pending request
    const existingPendingRequest = await BalanceRequest.findOne({
      userId: req.user.userId,
      status: 'pending'
    });

    if (existingPendingRequest) {
      console.log('User already has pending request');
      return res.status(400).json({ message: 'You already have a pending balance request' });
    }

    console.log('Creating new balance request...');
    const balanceRequest = new BalanceRequest({
      userId: req.user.userId,
      username: user.username,
      userEmail: user.email,
      userPhone: user.phone,
      requestedAmount: parseFloat(requestedAmount),
      reason: reason.trim()
    });

    await balanceRequest.save();
    console.log('Balance request saved successfully:', balanceRequest._id);

    res.status(201).json({
      message: 'Balance request submitted successfully',
      request: balanceRequest
    });
  } catch (error) {
    console.error('Error in requestBalance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's balance request history
exports.getBalanceRequestHistory = async (req, res) => {
  try {
    const requests = await BalanceRequest.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};