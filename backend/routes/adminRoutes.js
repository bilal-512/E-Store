const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { requireAdmin, requireSuperAdmin, requirePermission } = require('../middleware/adminMiddleware');
const {
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
} = require('../controllers/adminController');

// Apply authentication to all admin routes
router.use(authenticateToken);

// ==================== DASHBOARD & REPORTS ====================
router.get('/dashboard', requireAdmin, getDashboardStats);

// ==================== USER MANAGEMENT ====================
router.get('/users', requirePermission('manageUsers'), getAllUsers);
router.put('/users/:userId/role', requirePermission('manageUsers'), updateUserRole);
router.put('/users/:userId/deactivate', requirePermission('manageUsers'), deactivateUser);
router.put('/users/:userId/activate', requirePermission('manageUsers'), activateUser);
router.put('/users/:userId/balance', requirePermission('manageUsers'), updateUserBalance);
router.put('/users/:userId/details', requirePermission('manageUsers'), updateUserDetails);

// ==================== EVENT MANAGEMENT ====================
router.post('/events', requirePermission('manageEvents'), createEvent);
router.put('/events/:eventId', requirePermission('manageEvents'), updateEvent);
router.delete('/events/:eventId', requirePermission('manageEvents'), deleteEvent);

// ==================== STORE MANAGEMENT ====================
router.post('/products', requirePermission('manageStore'), addProduct);
router.put('/products/:productId', requirePermission('manageStore'), updateProduct);
router.delete('/products/:productId', requirePermission('manageStore'), deleteProduct);
router.get('/products/category/:category', requirePermission('manageStore'), getProductsByCategory);
router.put('/products/:productId/stock', requirePermission('manageStore'), updateProductStock);
router.get('/products/low-stock', requirePermission('manageStore'), getLowStockProducts);

// ==================== COMPLAINT MANAGEMENT ====================
router.get('/complaints', requirePermission('manageComplaints'), getAllComplaints);
router.put('/complaints/:complaintId/status', requirePermission('manageComplaints'), updateComplaintStatus);

// ==================== BILL MANAGEMENT ====================
router.post('/bills/generate-all', requirePermission('manageBills'), generateBillsForAll);

// ==================== BALANCE REQUEST MANAGEMENT ====================
router.get('/balance-requests', requirePermission('manageUsers'), getAllBalanceRequests);
router.put('/balance-requests/:requestId/process', requirePermission('manageUsers'), processBalanceRequest);

// Test routes (placed at the end to avoid conflicts)
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes are working!' });
});

router.get('/test-auth', (req, res) => {
  res.json({ message: 'Admin auth test successful!', user: req.user });
});

module.exports = router; 