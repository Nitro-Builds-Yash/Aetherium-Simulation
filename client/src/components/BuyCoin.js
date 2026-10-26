import React, { useState } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function BuyCoin() {
  const { user, marketStats, refreshUserData } = useAuth();
  const [fiatAmount, setFiatAmount] = useState('100');
  const [loading, setLoading] = useState(false);

  const tokenPrice = marketStats?.price || 3.48;
  const tokensToReceive = fiatAmount ? (parseFloat(fiatAmount) / tokenPrice).toFixed(2) : '0.00';

  const handleBuy = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error('Connect your wallet first');
      return;
    }

    const amountNum = parseFloat(tokensToReceive);
    if (!amountNum || amountNum <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/wallet/buy`, {
        userId: user._id,
        amount: amountNum,
        fiatPaid: parseFloat(fiatAmount)
      });

      toast.success(`Success! Added ${amountNum} ATH to your wallet`);
      refreshUserData(user._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
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
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.45)'
        }}>
          <ShoppingBag size={30} color="#fff" />
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900 }}>
          Buy ATH Tokens
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.94rem', marginTop: '0.4rem' }}>
          Simulated fiat gateway. Purchase testnet ATH tokens directly at current oracle rates.
        </p>
      </div>

      <form onSubmit={handleBuy}>
        <div className="input-group">
          <label className="input-label">Payment Amount (USD)</label>
          <div style={{ position: 'relative' }}>
            <span style={{ 
              position: 'absolute', 
              left: '1.2rem', 
              top: '1rem', 
              color: '#94a3b8', 
              fontWeight: 800, 
              fontSize: '1.2rem' 
            }}>$</span>
            <input 
              type="number" 
              className="form-input" 
              style={{ paddingLeft: '2.6rem', fontSize: '1.25rem', fontWeight: 800 }}
              min="10" 
              max="50000"
              value={fiatAmount}
              onChange={(e) => setFiatAmount(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Quick select buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.8rem' }}>
          {['50', '100', '250', '500', '1000'].map(val => (
            <button
              key={val}
              type="button"
              className="btn-aether btn-ghost"
              style={{
                flex: 1,
                padding: '0.55rem 0',
                fontSize: '0.88rem',
                borderRadius: '12px',
                borderColor: fiatAmount === val ? '#06b6d4' : undefined,
                color: fiatAmount === val ? '#38bdf8' : undefined,
                background: fiatAmount === val ? 'rgba(6, 182, 212, 0.18)' : undefined
              }}
              onClick={() => setFiatAmount(val)}
            >
              ${val}
            </button>
          ))}
        </div>

        {/* Calculation summary */}
        <div style={{
          background: 'rgba(3, 7, 18, 0.8)',
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.92rem' }}>
            <span style={{ color: '#94a3b8' }}>Oracle Exchange Rate</span>
            <span style={{ fontFamily: 'var(--font-code)', fontWeight: 700 }}>1 ATH = ${tokenPrice.toFixed(4)} USD</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.92rem' }}>
            <span style={{ color: '#94a3b8' }}>Network Processing Fee</span>
            <span style={{ color: '#34d399', fontWeight: 800, fontFamily: 'var(--font-code)' }}>$0.00 (Testnet Waived)</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>Tokens to Receive</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-code)' }}>
              ≈ {tokensToReceive} <span style={{ fontSize: '1.1rem', color: '#c084fc' }}>ATH</span>
            </span>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn-aether btn-emerald" 
          style={{ width: '100%', padding: '1.1rem', fontSize: '1.1rem', borderRadius: '16px' }}
          disabled={loading}
        >
          {loading ? 'Processing Transaction...' : <>Confirm Purchase <ArrowRight size={20} /></>}
        </button>
      </form>
    </div>
  );
}
