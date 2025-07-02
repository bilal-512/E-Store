const Doctor = require('../models/Doctor');

exports.getDoctors = async (req, res) => {
  try {
    let doctors = await Doctor.find();
    if (doctors.length === 0) {
      const defaultDoctors = [
        { name: "Dr. Ali", contactNo: "+92321-3747345", specialization: "Fever" },
        { name: "Dr. Naqvi", contactNo: "+92345-2372099", specialization: "Fever" },
        { name: "Dr. Ahmed", contactNo: "+92365-3248593", specialization: "Headache" },
        { name: "Dr. Fahad", contactNo: "+92325-5783239", specialization: "Headache" },
        { name: "Dr. Raheel", contactNo: "+92312-9080901", specialization: "Malaria" },
        { name: "Dr. Siddique", contactNo: "+92318-2849229", specialization: "Malaria" },
        { name: "Dr. Jahanzaib", contactNo: "+92323-4522907", specialization: "Typhoid" },
        { name: "Dr. Maheen", contactNo: "+92345-7264786", specialization: "Typhoid" },
        { name: "Dr. Abdullah", contactNo: "+92335-2873912", specialization: "Diabetes" },
        { name: "Dr. Zainab", contactNo: "+92321-4545534", specialization: "Diabetes" }
      ];
      doctors = await Doctor.create(defaultDoctors);
    }
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
