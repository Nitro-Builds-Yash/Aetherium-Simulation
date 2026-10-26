import React, { useState } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Layers, Lock, Unlock, Percent } from 'lucide-react';

export default function StakingVault() {
  const { user, refreshUserData } = useAuth();
  const [amount, setAmount] = useState('');
  const [tab, setTab] = useState('stake');
  const [loading, setLoading] = useState(false);

  const handleStaking = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error('Connect your wallet first');
      return;
    }

    const stakeVal = parseFloat(amount);
    if (!stakeVal || stakeVal <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/wallet/stake`, {
        userId: user._id,
        amount: stakeVal,
        action: tab
      });

      toast.success(res.data.message);
      setAmount('');
      refreshUserData(user._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Vault operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '1rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(6, 182, 212, 0.15))',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          color: '#c084fc',
          padding: '0.4rem 1.1rem',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          fontWeight: 800,
          marginBottom: '0.8rem'
        }}>
          <Layers size={16} /> LIQUIDITY VAULT
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
          Staking Vault & Yield
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.96rem', marginTop: '0.4rem' }}>
          Lock ATH tokens into the automated liquidity contract to earn annualized 8.5% APY rewards.
        </p>
      </div>

      {/* Yield Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem', marginBottom: '1.8rem' }}>
        <div className="stat-box">
          <div className="stat-box-label">
            <Lock size={16} color="#c084fc" /> Total Staked
          </div>
          <div className="stat-box-value">
            {user?.stakedAmount?.toLocaleString() || 0} <span style={{ fontSize: '1.2rem', color: '#c084fc' }}>ATH</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.4rem' }}>
            Compounding per confirmed block
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-label">
            <Percent size={16} color="#34d399" /> Current APY Yield
          </div>
          <div className="stat-box-value" style={{ color: '#34d399' }}>
            8.50%
          </div>
          <div style={{ fontSize: '0.85rem', color: '#34d399', marginTop: '0.4rem', fontWeight: 700 }}>
            Automated testnet reward distribution
          </div>
        </div>
      </div>

      <div className="aether-card">
        {/* Toggle Pill Buttons */}
        <div style={{
          display: 'flex',
          background: 'rgba(3, 7, 18, 0.85)',
          padding: '0.4rem',
          borderRadius: '16px',
          marginBottom: '2rem'
        }}>
          <button 
            type="button" 
            onClick={() => setTab('stake')}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: tab === 'stake' ? 'linear-gradient(135deg, #9333ea, #7c3aed)' : 'transparent',
              color: tab === 'stake' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.94rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              transition: 'all 0.25s',
              boxShadow: tab === 'stake' ? '0 4px 18px rgba(147, 51, 234, 0.5)' : 'none'
            }}
          >
            <Lock size={16} /> Stake Tokens
          </button>
          <button 
            type="button" 
            onClick={() => setTab('unstake')}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: tab === 'unstake' ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'transparent',
              color: tab === 'unstake' ? '#fff' : '#94a3b8',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.94rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              transition: 'all 0.25s',
              boxShadow: tab === 'unstake' ? '0 4px 18px rgba(6, 182, 212, 0.5)' : 'none'
            }}
          >
            <Unlock size={16} /> Unstake Tokens
          </button>
        </div>

        <form onSubmit={handleStaking}>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label className="input-label" style={{ marginBottom: 0 }}>
                {tab === 'stake' ? 'Amount to Stake' : 'Amount to Unstake'}
              </label>
              <button 
                type="button" 
                onClick={() => setAmount(String(tab === 'stake' ? user?.balance || 0 : user?.stakedAmount || 0))}
                style={{ background: 'none', border: 'none', color: '#c084fc', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 800 }}
              >
                Available: {tab === 'stake' ? `${user?.balance || 0} ATH` : `${user?.stakedAmount || 0} ATH`}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="number" 
                className="form-input" 
                placeholder="0.00"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <span style={{ position: 'absolute', right: '1.4rem', top: '1rem', fontWeight: 800, color: '#64748b', fontFamily: 'var(--font-code)' }}>
                ATH
              </span>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-aether" 
            style={{
              width: '100%',
              padding: '1.1rem',
              fontSize: '1.1rem',
              borderRadius: '16px',
              color: '#fff',
              background: tab === 'stake' ? 'linear-gradient(135deg, #9333ea, #6366f1)' : 'linear-gradient(135deg, #06b6d4, #0284c7)',
              boxShadow: tab === 'stake' ? '0 4px 25px rgba(147, 51, 234, 0.45)' : '0 4px 25px rgba(6, 182, 212, 0.45)'
            }}
            disabled={loading}
          >
            {loading ? 'Processing Operation...' : (tab === 'stake' ? 'Confirm Staking' : 'Withdraw to Available Balance')}
          </button>
        </form>
      </div>
    </div>
  );
}
