const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get All Users (SA & UNO)
exports.getUsers = async (req, res) => {
  try {
    let users;
    if (req.user.role === 'sa') {
      users = await User.find();
    } else if (req.user.role === 'uno') {
      users = await User.find({ role: 'unionAdmin' });
    } else {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Create User (SA only)
exports.createUser = async (req, res) => {
    try {
      const { username, role, union } = req.body;
  
      // ✅ Ensure required fields are present
      if (!username || !role) {
        return res.status(400).json({ message: "Username and Role are required." });
      }
      if (role === "unionAdmin" && !union) {
        return res.status(400).json({ message: "Union is required for Union Admin." });
      }
  
      // ✅ Check for duplicate username
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
      }
  
      // ✅ Create user
      const newUser = new User({ username, role, union: role === "unionAdmin" ? union : undefined });
      await newUser.save();
  
      res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error.", error: error.message });
    }
  };
  

// Update User (SA & UNO for unionAdmins)
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    if (req.user.role === 'uno') {
      const user = await User.findById(userId);
      if (user.role !== 'unionAdmin') {
        return res.status(403).json({ message: 'UNO can only update UnionAdmins' });
      }
    }

    await User.findByIdAndUpdate(userId, updates);
    res.status(200).json({ message: 'User Updated Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete User (SA only)
exports.deleteUser = async (req, res) => {
  if (req.user.role !== 'sa') return res.status(403).json({ message: 'Access forbidden' });

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: 'User Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Update Own Profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    await User.findByIdAndUpdate(req.user.userId, updates);
    res.status(200).json({ message: 'Profile Updated Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
};
