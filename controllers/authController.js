const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login API
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
};
