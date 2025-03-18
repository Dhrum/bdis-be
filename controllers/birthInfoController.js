const BirthInfo = require('../models/BirthInfo');

// api/birth-info/submit-birth
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
  const { status, union, upazila, date } = req.query;

  let query = {};

  // Modify the query for the status filter to include both "Entry" and null
  if (status) {
    if (status === 'Entry') {
      query['status'] = { $in: ['Entry', null] };  // Match both "Entry" and null
    } else {
      query['status'] = { $regex: new RegExp(`^${status}$`, 'i') };  // Case-insensitive matching for other statuses
    }
  }
  
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

// Update Birth Info Status
exports.updateBirthInfoStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const birthInfo = await BirthInfo.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!birthInfo) {
      return res.status(404).json({ message: 'Birth info not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', data: birthInfo });
  } catch (error) {
    res.status(500).json({ message: 'Error updating birth info status', error });
  }
};
