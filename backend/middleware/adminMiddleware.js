const User = require('../models/User');

// Check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.adminUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check if user is super admin
const requireSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Super admin access required' });
    }
    req.adminUser = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check specific permission
const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user || user.role === 'user') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      if (user.role === 'super_admin') {
        req.adminUser = user;
        return next();
      }
      
      if (!user.permissions[permission]) {
        return res.status(403).json({ message: `Permission denied: ${permission}` });
      }
      
      req.adminUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

module.exports = { requireAdmin, requireSuperAdmin, requirePermission }; 