const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  try {
    const { complaintType, complaintDetails } = req.body;
    const complaint = new Complaint({
      userId: req.user.userId,
      username: req.user.username,
      complaintType,
      complaintDetails
    });
    await complaint.save();
    res.status(201).json({ message: 'Complaint registered', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};