const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, disease } = req.body;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor || !doctor.isAvailable) {
      return res.status(400).json({ message: 'Doctor not available' });
    }

    const appointment = new Appointment({
      userId: req.user.userId,
      username: req.user.username,
      doctorId,
      disease
    });

    await appointment.save();
    doctor.isAvailable = false;
    await doctor.save();

    res.status(201).json({ message: 'Appointment booked', appointment, doctor: doctor.name });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};