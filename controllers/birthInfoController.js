const BirthInfo = require('../models/BirthInfo');

// Submit Birth Info
exports.submitBirthInfo = async (req, res) => {
  try {
    const birthInfo = new BirthInfo(req.body);
    await birthInfo.save();
    res.status(201).json({ message: 'Birth Info Submitted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting birth info', error });
  }
};

// Get Birth Info
exports.getBirthInfo = async (req, res) => {
  const { union, upazila, date } = req.query;

  let query = {};
  if (union) query['permanentAddress.union'] = union;
  if (upazila) query['permanentAddress.upazila'] = upazila;
  if (date) query['date'] = { $gte: new Date(date) };

  try {
    const birthInfo = await BirthInfo.find(query);
    res.status(200).json(birthInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching birth info', error });
  }
};
