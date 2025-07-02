const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/society_management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: 'super_admin' });
    if (existingAdmin) {
      // Super admin already exists, exit function
      return;
    }

    // Create super admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const superAdmin = new User({
      username: 'superadmin',
      password: hashedPassword,
      name: 'Super Administrator',
      phone: '03001234567',
      email: 'admin@society.com',
      role: 'super_admin',
      permissions: {
        manageUsers: true,
        manageEvents: true,
        manageStore: true,
        manageComplaints: true,
        manageBills: true,
        manageAppointments: true,
        viewReports: true
      },
      isActive: true
    });

    await superAdmin.save();
    // Super admin created successfully

  } catch (error) {
    // Only log essential error
    console.error('Error creating super admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createSuperAdmin(); 