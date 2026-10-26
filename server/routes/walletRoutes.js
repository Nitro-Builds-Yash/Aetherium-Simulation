const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

function generateTxHash() {
  return '0x' + crypto.randomBytes(32).toString('hex');
}

// 1. Get Wallet Profile & Balance
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// 2. Mine Coins (simulated Proof-of-Work reward)
router.post('/mine', async (req, res) => {
  const { userId, amount, nonce, hash } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const reward = Math.max(1, parseInt(amount) || 5);
    user.balance += reward;
    await user.save();

    const txHash = hash || generateTxHash();
    await Transaction.create({
      userId: user._id,
      type: 'mine',
      amount: reward,
      txHash,
      counterparty: `Proof of Work (Nonce: ${nonce || 4281})`
    });

    res.json({
      message: `Successfully mined block! Reward: ${reward} ATH`,
      balance: user.balance,
      txHash
    });
  } catch (err) {
    console.error('Mining error:', err);
    res.status(500).json({ error: 'Mining failed' });
  }
});

// 3. Buy Coins
router.post('/buy', async (req, res) => {
  const { userId, amount, fiatPaid } = req.body;
  try {
    const coinAmount = parseFloat(amount);
    if (!coinAmount || coinAmount <= 0) {
      return res.status(400).json({ message: 'Invalid purchase amount' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.balance += coinAmount;
    await user.save();

    const txHash = generateTxHash();
    await Transaction.create({
      userId: user._id,
      type: 'buy',
      amount: coinAmount,
      txHash,
      counterparty: `Fiat Gateway ($${fiatPaid || (coinAmount * 1.25).toFixed(2)})`
    });

    res.json({
      success: true,
      message: `Purchased ${coinAmount} ATH successfully!`,
      balance: user.balance,
      txHash
    });
  } catch (err) {
    console.error('Buying error:', err);
    res.status(500).json({ error: 'Purchase failed' });
  }
});

// 4. P2P Transfer (Send to another user via Wallet Address or Username)
router.post('/transfer', async (req, res) => {
  const { senderId, recipientIdentifier, amount } = req.body;
  const transferAmount = parseFloat(amount);

  if (!transferAmount || transferAmount <= 0) {
    return res.status(400).json({ message: 'Invalid transfer amount' });
  }

  try {
    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ message: 'Sender not found' });

    if (sender.balance < transferAmount) {
      return res.status(400).json({ message: 'Insufficient funds for transfer' });
    }

    // Find recipient by walletAddress or username
    const recipient = await User.findOne({
      $or: [
        { walletAddress: recipientIdentifier },
        { username: recipientIdentifier }
      ]
    });

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient wallet/username not found' });
    }

    if (recipient._id.toString() === sender._id.toString()) {
      return res.status(400).json({ message: 'Cannot transfer funds to yourself' });
    }

    // Execute transfer
    sender.balance -= transferAmount;
    recipient.balance += transferAmount;

    await sender.save();
    await recipient.save();

    const txHash = generateTxHash();

    // Sender record
    await Transaction.create({
      userId: sender._id,
      type: 'transfer_send',
      amount: transferAmount,
      counterparty: recipient.username,
      txHash
    });

    // Recipient record
    await Transaction.create({
      userId: recipient._id,
      type: 'transfer_receive',
      amount: transferAmount,
      counterparty: sender.username,
      txHash
    });

    res.json({
      success: true,
      message: `Transferred ${transferAmount} ATH to ${recipient.username}`,
      balance: sender.balance,
      txHash
    });
  } catch (err) {
    console.error('Transfer error:', err);
    res.status(500).json({ error: 'Transfer transaction failed' });
  }
});

// 5. Staking (Lock funds to earn yields)
router.post('/stake', async (req, res) => {
  const { userId, amount, action } = req.body; // action: 'stake' or 'unstake'
  const stakeAmount = parseFloat(amount);

  if (!stakeAmount || stakeAmount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const txHash = generateTxHash();

    if (action === 'stake') {
      if (user.balance < stakeAmount) {
        return res.status(400).json({ message: 'Insufficient balance to stake' });
      }
      user.balance -= stakeAmount;
      user.stakedAmount = (user.stakedAmount || 0) + stakeAmount;
      user.lastStakedAt = new Date();
      await user.save();

      await Transaction.create({
        userId: user._id,
        type: 'stake',
        amount: stakeAmount,
        txHash,
        counterparty: 'Aetherium Staking Vault (8.5% APY)'
      });

      return res.json({
        success: true,
        message: `Staked ${stakeAmount} ATH!`,
        balance: user.balance,
        stakedAmount: user.stakedAmount,
        txHash
      });
    } else if (action === 'unstake') {
      if ((user.stakedAmount || 0) < stakeAmount) {
        return res.status(400).json({ message: 'Cannot unstake more than currently staked' });
      }
      user.stakedAmount -= stakeAmount;
      user.balance += stakeAmount;
      await user.save();

      await Transaction.create({
        userId: user._id,
        type: 'unstake',
        amount: stakeAmount,
        txHash,
        counterparty: 'Aetherium Staking Vault'
      });

      return res.json({
        success: true,
        message: `Unstaked ${stakeAmount} ATH to main wallet!`,
        balance: user.balance,
        stakedAmount: user.stakedAmount,
        txHash
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Staking operation failed' });
  }
});

// 6. Leaderboard (Top Miners/Holders)
router.get('/leaderboard', async (req, res) => {
  try {
    const topHolders = await User.find({})
      .select('username walletAddress balance stakedAmount')
      .sort({ balance: -1 })
      .limit(10);
    res.json(topHolders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
});

module.exports = router;
