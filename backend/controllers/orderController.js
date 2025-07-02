const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Place a new order
const placeOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const { userId, username } = req.user;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Process each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });

      // Update product quantity
      product.quantity -= item.quantity;
      await product.save();
    }

    // Check user balance
    const user = await User.findById(userId);
    if (user.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct amount from user balance
    user.balance -= totalAmount;
    await user.save();

    // Create order
    const order = new Order({
      userId,
      username,
      items: orderItems,
      totalAmount
    });

    await order.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order: order,
      remainingBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { placeOrder }; 