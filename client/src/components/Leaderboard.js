import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function Leaderboard() {
  const [miners, setMiners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_URL}/wallet/leaderboard`);
        setMiners(res.data);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: 60,
          height: 60,
          margin: '0 auto 1.2rem',
          borderRadius: 20,
          background: 'linear-gradient(135deg, #fbbf24, #d97706)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)'
        }}>
          <Trophy size={32} color="#fff" />
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 900 }}>Top Holders Leaderboard</h1>
        <p style={{ color: '#94a3b8', marginTop: '0.4rem', fontSize: '0.96rem' }}>
          Network rankings of highest wallet balances and staking positions
        </p>
      </div>

      <div className="aether-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            Loading rankings...
          </div>
        ) : miners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            No registered users found.
          </div>
        ) : (
          <div className="custom-table-container" style={{ border: 'none' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '90px' }}>Rank</th>
                  <th>Username</th>
                  <th>Wallet Address</th>
                  <th>Staked</th>
                  <th>Total Balance</th>
                </tr>
              </thead>
              <tbody>
                {miners.map((m, idx) => (
                  <tr key={m._id || idx}>
                    <td style={{ fontWeight: 900, fontSize: '1.1rem' }}>
                      {idx === 0 ? <Crown size={24} color="#fbbf24" /> :
                       idx === 1 ? <Medal size={24} color="#e2e8f0" /> :
                       idx === 2 ? <Medal size={24} color="#f97316" /> :
                       <span style={{ color: '#64748b' }}>#{idx + 1}</span>}
                    </td>
                    <td style={{ fontWeight: 800 }}>
                      <span style={{ color: idx < 3 ? '#c084fc' : '#f8fafc' }}>
                        {m.username}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-code)', fontSize: '0.88rem', color: '#64748b' }}>
                      {m.walletAddress ? `${m.walletAddress.slice(0, 8)}...${m.walletAddress.slice(-6)}` : '0x...'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-code)', color: '#c084fc', fontWeight: 700 }}>
                      {m.stakedAmount || 0} ATH
                    </td>
                    <td style={{ fontWeight: 900, fontFamily: 'var(--font-code)', color: '#34d399', fontSize: '1.05rem' }}>
                      {m.balance?.toLocaleString() || 0} ATH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
