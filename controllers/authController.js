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
  console.log('hitted');
  const { username, password } = req.body;

  console.log("Username: ", username);
  console.log("Password: ", password);

  const trimmed = username.trim().toLowerCase();
  console.log("trimmed: ", trimmed);

  try {
    // Ensure the query is correct
    const user = await User.findOne({ username: trimmed });

    if (!user) {
      console.log('no user found', trimmed);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = generateToken(user);
    console.log(user, token);

    res.json({
      token,
      role: user.role,
      union: user.union || null,
      username: user.username,  // Return the username from the database
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};


// Ensure SA exists on server start
ensureSuperAdminExists();
