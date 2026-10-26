// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['mine', 'buy', 'transfer_send', 'transfer_receive', 'stake', 'unstake'], 
    required: true 
  },
  amount: { type: Number, required: true },
  counterparty: { type: String }, // wallet address or username for transfers
  txHash: { type: String, required: true },
  blockHeight: { type: Number, default: 1 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
