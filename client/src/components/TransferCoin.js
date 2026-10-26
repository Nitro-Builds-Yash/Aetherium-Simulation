import React, { useState } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Send, ArrowRight, Wallet } from 'lucide-react';

export default function TransferCoin() {
  const { user, refreshUserData } = useAuth();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error('Connect your wallet first');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    if (transferAmount > (user?.balance || 0)) {
      toast.error('Insufficient token balance');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/wallet/transfer`, {
        senderId: user._id,
        recipientIdentifier: recipient.trim(),
        amount: transferAmount
      });

      toast.success(res.data.message || 'Transfer completed successfully');
      setRecipient('');
      setAmount('');
      refreshUserData(user._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '2rem auto' }} className="aether-card">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: 60,
          height: 60,
          margin: '0 auto 1.2rem',
          borderRadius: 20,
          background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(168, 85, 247, 0.45)'
        }}>
          <Send size={30} color="#fff" />
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900 }}>
          P2P Token Transfer
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.94rem', marginTop: '0.4rem' }}>
          Transmit ATH tokens directly to another user by username or wallet address with zero fees.
        </p>
      </div>

      {/* Balance Pill */}
      <div style={{
        background: 'rgba(3, 7, 18, 0.8)',
        borderRadius: '16px',
        padding: '1rem 1.4rem',
        marginBottom: '1.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(168, 85, 247, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.9rem' }}>
          <Wallet size={18} color="#06b6d4" /> Available Balance:
        </div>
        <div style={{ fontFamily: 'var(--font-code)', fontWeight: 800, color: '#38bdf8', fontSize: '1.15rem' }}>
          {user?.balance?.toLocaleString() || 0} ATH
        </div>
      </div>

      <form onSubmit={handleTransfer}>
        <div className="input-group">
          <label className="input-label">Recipient (Username or 0x Wallet Address)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. Satoshi or 0xA4F8...9B"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label className="input-label" style={{ marginBottom: 0 }}>Transfer Amount</label>
            <button 
              type="button" 
              onClick={() => setAmount(String(user?.balance || 0))}
              style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 800 }}
            >
              MAX BALANCE
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              className="form-input" 
              placeholder="0.00"
              min="0.1" 
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <span style={{ 
              position: 'absolute', 
              right: '1.4rem', 
              top: '1rem', 
              fontWeight: 800, 
              color: '#64748b',
              fontFamily: 'var(--font-code)'
            }}>
              ATH
            </span>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-aether btn-crystal" 
          style={{ width: '100%', padding: '1.1rem', fontSize: '1.1rem', marginTop: '0.5rem', borderRadius: '16px' }}
          disabled={loading}
        >
          {loading ? 'Submitting Transfer...' : <>Confirm Transfer <ArrowRight size={20} /></>}
        </button>
      </form>
    </div>
  );
}
