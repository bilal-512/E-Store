const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },      // e.g., "Basmati Rice"
  category: { 
    type: String, 
    required: true,
    enum: ['groceries', 'electronics', 'clothing', 'household', 'books', 'sports', 'beauty', 'other']
  },
  description: { type: String, default: '' },  // Product description
  quantity: { type: Number, required: true },  // available stock
  price: { type: Number, required: true },     // price per unit
  unit: { type: String, default: 'piece' },   // unit of measurement (kg, piece, etc.)
  minStock: { type: Number, default: 5 },     // minimum stock level for alerts
  isActive: { type: Boolean, default: true }, // product availability
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Product', productSchema);
