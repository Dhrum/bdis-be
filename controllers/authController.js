const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT Token

// Function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role, union: user.union || null },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Predefined Super Admin
const ensureSuperAdminExists = async () => {
  const saExists = await User.findOne({ role: 'sa' });
  if (!saExists) {
    const saUser = new User({
      username: 'superadmin',
      password: '12345678',
      fullName: 'Super Admin',
      role: 'sa',
    });
    await saUser.save();
    console.log('Super Admin Created');
  }
};

// Login API
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'Invalid username or password' });

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) return res.status(400).json({ message: 'Invalid username or password' });

  const token = generateToken(user);
  res.json({ token, role: user.role, union: user.union || null });
};

// Ensure SA exists on server start
ensureSuperAdminExists();
