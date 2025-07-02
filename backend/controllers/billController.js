// ✅ backend/controllers/billController.js
const Bill = require('../models/Bill');
const User = require('../models/User');

exports.generateOrFetchBills = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const houseSize = user.house.marlaSize;
    let electricityAmount, gasAmount;

    if (houseSize === 5) {
      electricityAmount = gasAmount = 3000 * 1.05;
    } else if (houseSize === 10) {
      electricityAmount = gasAmount = 5000 * 1.10;
    } else if (houseSize === 20) {
      electricityAmount = gasAmount = 8000 * 1.15;
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const existingBills = await Bill.find({
      userId: req.user.userId,
      createdAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1)
      }
    });

    if (existingBills.length === 0) {
      const dueDate = new Date();
      dueDate.setDate(9);

      const electricityBill = new Bill({
        userId: req.user.userId,
        username: req.user.username,
        billType: 'electricity',
        amount: electricityAmount,
        dueDate
      });

      const gasBill = new Bill({
        userId: req.user.userId,
        username: req.user.username,
        billType: 'gas',
        amount: gasAmount,
        dueDate
      });

      await electricityBill.save();
      await gasBill.save();

      return res.json([electricityBill, gasBill]);
    }

    res.json(existingBills);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.payBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    const user = await User.findById(req.user.userId);

    if (!bill || bill.userId.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    if (bill.isPaid) {
      return res.status(400).json({ message: 'Bill already paid' });
    }

    const currentDate = new Date();
    const dueDate = new Date(bill.dueDate);
    let totalAmount = bill.amount;

    if (currentDate > dueDate) {
      const daysOverdue = Math.ceil((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      const penalty = daysOverdue * 97.3;
      totalAmount += penalty;
      bill.penalty = penalty;
    }

    if (user.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= totalAmount;
    bill.isPaid = true;
    bill.paidAt = new Date();

    await user.save();
    await bill.save();

    res.json({
      message: 'Bill paid successfully',
      remainingBalance: user.balance,
      paidAmount: totalAmount,
      penalty: bill.penalty || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};