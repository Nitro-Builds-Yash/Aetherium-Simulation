const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Get transactions for a user
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(50);
    res.json(transactions);
  } catch (err) {
    console.error('Fetch transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Global ledger (simulated public blockchain feed)
router.get('/ledger/recent', async (req, res) => {
  try {
    const recentBlocks = await Transaction.find({})
      .sort({ date: -1 })
      .limit(15);
    res.json(recentBlocks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load public ledger' });
  }
});

module.exports = router;
