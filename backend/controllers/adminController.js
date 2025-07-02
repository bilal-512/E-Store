const User = require('../models/User');
const Event = require('../models/Event');
const Product = require('../models/Product');
const Complaint = require('../models/Complaint');
const Bill = require('../models/Bill');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const BalanceRequest = require('../models/BalanceRequest');

// ==================== USER MANAGEMENT ====================
const getAllUsers = async (req, res) => {
  try {
    console.log('getAllUsers called by user:', req.user);
    console.log('adminUser:', req.adminUser);
    
    const users = await User.find().select('-password');
    console.log('Found users:', users.length);
    
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, permissions } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    if (permissions) {
      user.permissions = { ...user.permissions, ...permissions };
    }
    
    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isActive = false;
    await user.save();
    
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { balance, operation } = req.body; // operation: 'set' or 'add'
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (operation === 'add') {
      user.balance += parseFloat(balance);
    } else {
      user.balance = parseFloat(balance);
    }
    
    await user.save();
    res.json({ message: 'User balance updated successfully', user: { _id: user._id, balance: user.balance } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, email, house } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (house) {
      if (house.marlaSize) user.house.marlaSize = house.marlaSize;
      if (house.choice) user.house.choice = house.choice;
    }
    
    await user.save();
    res.json({ message: 'User details updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isActive = true;
    await user.save();
    
    res.json({ message: 'User activated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== EVENT MANAGEMENT ====================
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

// ==================== STORE MANAGEMENT ====================
const addProduct = async (req, res) => {
  try {
    const { name, category, description, quantity, price, unit, minStock } = req.body;
    
    const product = new Product({
      name,
      category,
      description: description || '',
      quantity,
      price,
      unit: unit || 'piece',
      minStock: minStock || 5
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;
    
    const product = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category, isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product stock
const updateProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, price } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.quantity = quantity;
    if (price) product.price = price;
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get low stock products
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$minStock'] },
      isActive: true
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== COMPLAINT MANAGEMENT ====================
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'name username');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;
    
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    ).populate('userId', 'name username');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== BILL MANAGEMENT ====================
const generateBillsForAll = async (req, res) => {
  try {
    const users = await User.find({ role: 'user', isActive: true });
    const bills = [];
    
    for (const user of users) {
      const houseSize = user.house.marlaSize;
      let electricityAmount, gasAmount;
      
      if (houseSize === 5) {
        electricityAmount = gasAmount = 3000 * 1.05;
      } else if (houseSize === 10) {
        electricityAmount = gasAmount = 5000 * 1.10;
      } else if (houseSize === 20) {
        electricityAmount = gasAmount = 8000 * 1.15;
      }
      
      const dueDate = new Date();
      dueDate.setDate(9);
      
      const electricityBill = new Bill({
        userId: user._id,
        username: user.username,
        billType: 'electricity',
        amount: electricityAmount,
        dueDate
      });
      
      const gasBill = new Bill({
        userId: user._id,
        username: user.username,
        billType: 'gas',
        amount: gasAmount,
        dueDate
      });
      
      await electricityBill.save();
      await gasBill.save();
      
      bills.push(electricityBill, gasBill);
    }
    
    res.json({ message: 'Bills generated for all users', count: bills.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== BALANCE REQUEST MANAGEMENT ====================
const getAllBalanceRequests = async (req, res) => {
  try {
    const requests = await BalanceRequest.find()
      .populate('userId', 'name username email phone')
      .populate('processedBy', 'name username')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const processBalanceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, adminNotes } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected"' });
    }

    const balanceRequest = await BalanceRequest.findById(requestId);
    if (!balanceRequest) {
      return res.status(404).json({ message: 'Balance request not found' });
    }

    if (balanceRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    // Update request status
    balanceRequest.status = status;
    balanceRequest.adminNotes = adminNotes;
    balanceRequest.processedBy = req.user.userId;
    balanceRequest.processedAt = new Date();

    await balanceRequest.save();

    // If approved, add balance to user account
    if (status === 'approved') {
      const user = await User.findById(balanceRequest.userId);
      if (user) {
        user.balance += balanceRequest.requestedAmount;
        await user.save();
      }
    }

    res.json({
      message: `Balance request ${status} successfully`,
      request: balanceRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== REPORTS & ANALYTICS ====================
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const totalEvents = await Event.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const recentComplaints = await Complaint.find()
      .populate('userId', 'name username')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentOrders = await Order.find()
      .populate('userId', 'name username')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      stats: {
        totalUsers,
        totalComplaints,
        pendingComplaints,
        totalEvents,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentComplaints,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  // User Management
  getAllUsers,
  updateUserRole,
  deactivateUser,
  updateUserBalance,
  updateUserDetails,
  activateUser,
  
  // Event Management
  createEvent,
  updateEvent,
  deleteEvent,
  
  // Store Management
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  updateProductStock,
  getLowStockProducts,
  
  // Complaint Management
  getAllComplaints,
  updateComplaintStatus,
  
  // Bill Management
  generateBillsForAll,
  
  // Balance Request Management
  getAllBalanceRequests,
  processBalanceRequest,
  
  // Reports & Analytics
  getDashboardStats
}; 