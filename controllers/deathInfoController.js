const DeathInfo = require('../models/DeathInfo');

// Submit Death Info
exports.submitDeathInfo = async (req, res) => {
  try {
    const deathInfo = new DeathInfo(req.body);
    await deathInfo.save();
    res.status(201).json({ message: 'Death Info Submitted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting death info', error });
  }
};

// Get Death Info
exports.getDeathInfo = async (req, res) => {
  const { union, upazila, date } = req.query;

  let query = {};
  if (union) query['permanentAddress.union'] = union;
  if (upazila) query['permanentAddress.upazila'] = upazila;
  if (date) query['date'] = { $gte: new Date(date) };

  try {
    const deathInfo = await DeathInfo.find(query);
    res.status(200).json(deathInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching death info', error });
  }
};
