// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  walletAddress: { type: String, unique: true },
  balance: { type: Number, default: 100 }, // Welcome bonus 100 ATH
  stakedAmount: { type: Number, default: 0 },
  lastStakedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate unique simulated wallet address if not provided
userSchema.pre('save', function (next) {
  if (!this.walletAddress) {
    const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    this.walletAddress = '0x' + randomHex.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
