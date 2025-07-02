const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  balance: { type: Number, default: 0 },
  house: {
    marlaSize: { type: Number, default: 5 },
    choice: { type: Number, default: 1 }
  },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'super_admin'], 
    default: 'user' 
  },
  permissions: {
    manageUsers: { type: Boolean, default: false },
    manageEvents: { type: Boolean, default: false },
    manageStore: { type: Boolean, default: false },
    manageComplaints: { type: Boolean, default: false },
    manageBills: { type: Boolean, default: false },
    manageAppointments: { type: Boolean, default: false },
    viewReports: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
