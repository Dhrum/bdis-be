const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true, default: '12345678' }, // Default password
  fullName: { type: String },
  email: { type: String, unique: true, sparse: true }, // Optional
  mobile: { type: String },
  designation: { type: String },
  role: { type: String, enum: ['sa', 'uno', 'unionAdmin'], required: true },
  union: { type: String, required: function () { return this.role === 'unionAdmin'; } }, // Required only for unionAdmin
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
