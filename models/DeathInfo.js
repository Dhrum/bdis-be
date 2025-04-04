const mongoose = require('mongoose');

const deathInfoSchema = new mongoose.Schema({
  personName: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  mobile: { type: String },
  email: { type: String, optional: true },
  date: { type: Date, required: true },
  placeOfDeath: { type: String, enum: ['hospital', 'home'], required: false },
  hospitalName: { type: String, optional: true },
  hospitalAddress: { type: String, optional: true },
  homeAddress: { type: String, optional: true },
  permanentAddress: {
    roadHouse: { type: String, required: false },
    village: { type: String, required: false },
    ward: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9], required: true },
    union: { type: String, required: true },
    upazila: { type: String, default: 'Sitakunda', required: true },
    district: { type: String, default: 'Chittagong', required: true },
  },
  status: { type: String, enum: ['in-progress', 'done'], required: false },
});

const DeathInfo = mongoose.model('DeathInfo', deathInfoSchema);
module.exports = DeathInfo;
