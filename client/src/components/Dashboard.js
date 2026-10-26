import React, { useEffect, useState } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Cpu, 
  TrendingUp, 
  Pickaxe, 
  ArrowUpRight, 
  Send, 
  Layers, 
  Copy, 
  Check, 
  Shield, 
  Zap, 
  ArrowRight,
  TrendingDown,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function Dashboard() {
  const { user, marketStats, refreshUserData } = useAuth();
  const [copied, setCopied] = useState(false);
  const [recentTx, setRecentTx] = useState([]);
  const [timeframe, setTimeframe] = useState('1H');

  useEffect(() => {
    if (user?._id) {
      refreshUserData(user._id);
      fetchRecentTx();
    }
  }, [user?._id]);

  const fetchRecentTx = async () => {
    try {
      const res = await axios.get(`${API_URL}/transactions/${user._id}`);
      setRecentTx(res.data.slice(0, 6));
    } catch (err) {
      console.warn('Could not load recent txs:', err.message);
    }
  };

  const copyWallet = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      toast.success('Wallet address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const balance = user?.balance || 0;
  const staked = user?.stakedAmount || 0;
  const totalBalance = balance + staked;
  const usdValue = (totalBalance * (marketStats?.price || 3.48)).toFixed(2);

  const chartLabels = marketStats.history.length > 0 
    ? marketStats.history.map(h => h.time) 
    : ['10:00', '10:05', '10:10', '10:15', '10:20'];
  const chartValues = marketStats.history.length > 0 
    ? marketStats.history.map(h => h.price) 
    : [3.15, 3.28, 3.42, 3.39, 3.48];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        fill: true,
        label: 'ATH / USD',
        data: chartValues,
        borderColor: '#00f2fe',
        borderWidth: 2.5,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 240);
          gradient.addColorStop(0, 'rgba(0, 242, 254, 0.28)');
          gradient.addColorStop(1, 'rgba(0, 242, 254, 0.0)');
          return gradient;
        },
        tension: 0.38,
        pointRadius: 2,
        pointBackgroundColor: '#00f2fe',
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        grid: { color: 'rgba(255, 255, 255, 0.03)' }, 
        ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } } 
      },
      y: { 
        grid: { color: 'rgba(255, 255, 255, 0.03)' }, 
        ticks: { 
          color: '#64748b', 
          font: { family: 'JetBrains Mono', size: 10 },
          callback: (value) => `$${value.toFixed(2)}`
        } 
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d111a',
        titleColor: '#94a3b8',
        bodyColor: '#00f2fe',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8
      }
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="aether-card" style={{
        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.06) 0%, rgba(79, 172, 254, 0.04) 50%, rgba(16, 22, 34, 0.7) 100%)',
        border: '1px solid rgba(0, 242, 254, 0.2)',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(0, 242, 254, 0.12)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '0.3rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', color: '#00f2fe', fontWeight: 700, marginBottom: '0.9rem' }}>
            <Cpu size={14} /> SIMULATION TESTNET // ONLINE
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Portfolio Overview, <span style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.username}</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '600px' }}>
            Decentralized cryptocurrency simulation environment. Manage simulated digital assets, participate in Proof-of-Work block validation, and explore decentralized transactions.
          </p>
        </div>

        {/* Wallet Address Card */}
        <div style={{
          background: 'rgba(13, 17, 26, 0.85)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.2rem 1.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              Primary Wallet Address
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.3rem' }}>
              {user?.walletAddress ? `${user.walletAddress.slice(0, 10)}...${user.walletAddress.slice(-6)}` : 'Generating...'}
            </div>
          </div>
          <button 
            onClick={copyWallet} 
            className="btn-aether btn-ghost" 
            style={{ padding: '0.6rem', borderRadius: '10px' }}
            title="Copy address"
          >
            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-box-label">
            <Zap size={16} color="#00f2fe" /> Available Balance
          </div>
          <div className="stat-box-value">
            {balance?.toLocaleString()} <span style={{ fontSize: '1.25rem', color: '#00f2fe' }}>ATH</span>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            ≈ ${(balance * (marketStats?.price || 3.48)).toFixed(2)} USD
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-label">
            <TrendingUp size={16} color="#4facfe" /> ATH Market Price
          </div>
          <div className="stat-box-value">
            ${marketStats.price.toFixed(4)}
          </div>
          <div style={{ fontSize: '0.88rem', color: '#10b981', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="pill-badge pill-green">ORACLE ONLINE</span>
            <span>+8.64% (24h)</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-label">
            <Shield size={16} color="#10b981" /> Total Staked
          </div>
          <div className="stat-box-value">
            {staked?.toLocaleString()} <span style={{ fontSize: '1.25rem', color: '#10b981' }}>ATH</span>
          </div>
          <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Estimated yield: <span style={{ color: '#10b981', fontWeight: 700 }}>8.50% APY</span>
          </div>
        </div>
      </div>

      {/* Market Chart & Operations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.6rem', marginBottom: '2.4rem' }}>
        {/* Real-Time Price Chart */}
        <div className="aether-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Price Index</h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Real-time price feed via Socket.io</p>
            </div>
            
            {/* Timeframe selector */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(13, 17, 26, 0.8)', padding: '0.25rem', borderRadius: '10px' }}>
              {['1H', '24H', '7D', 'ALL'].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  style={{
                    background: timeframe === t ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                    color: timeframe === t ? '#00f2fe' : '#64748b',
                    border: 'none',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: '250px', width: '100%' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Quick Operations Matrix */}
        <div className="aether-card">
          <div style={{ marginBottom: '1.4rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Quick Actions</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Initiate simulation network operations</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem' }}>
            <Link to="/mine" style={{ textDecoration: 'none' }}>
              <div className="aether-card" style={{ padding: '1.4rem 1rem', textAlign: 'center', background: 'rgba(13, 17, 26, 0.6)' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  margin: '0 auto 0.8rem',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24'
                }}>
                  <Pickaxe size={24} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Mine Blocks</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>Proof-of-Work Rig</div>
              </div>
            </Link>

            <Link to="/buy" style={{ textDecoration: 'none' }}>
              <div className="aether-card" style={{ padding: '1.4rem 1rem', textAlign: 'center', background: 'rgba(13, 17, 26, 0.6)' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  margin: '0 auto 0.8rem',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}>
                  <ArrowUpRight size={24} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Buy Tokens</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>Fiat Gateway</div>
              </div>
            </Link>

            <Link to="/transfer" style={{ textDecoration: 'none' }}>
              <div className="aether-card" style={{ padding: '1.4rem 1rem', textAlign: 'center', background: 'rgba(13, 17, 26, 0.6)' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  margin: '0 auto 0.8rem',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(79, 172, 254, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00f2fe'
                }}>
                  <Send size={24} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>P2P Transfer</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>Direct Send</div>
              </div>
            </Link>

            <Link to="/stake" style={{ textDecoration: 'none' }}>
              <div className="aether-card" style={{ padding: '1.4rem 1rem', textAlign: 'center', background: 'rgba(13, 17, 26, 0.6)' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  margin: '0 auto 0.8rem',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.2), rgba(168, 85, 247, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a855f7'
                }}>
                  <Layers size={24} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Staking Vault</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>8.50% APY Pool</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="aether-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recent Transactions</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Latest blockchain records for this wallet</p>
          </div>
          <Link to="/history" className="btn-aether btn-ghost" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', borderRadius: '9999px' }}>
            Full Transaction History <ArrowRight size={14} />
          </Link>
        </div>

        {recentTx.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No transactions found. Begin by mining a block or purchasing tokens.
          </div>
        ) : (
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>Amount</th>
                  <th>Counterparty / Channel</th>
                  <th>Transaction Hash</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map(tx => (
                  <tr key={tx._id}>
                    <td>
                      <span className={`pill-badge ${
                        tx.type === 'mine' ? 'pill-gold' :
                        tx.type === 'buy' ? 'pill-green' :
                        tx.type === 'transfer_send' ? 'pill-rose' :
                        tx.type === 'transfer_receive' ? 'pill-cyan' : 'pill-purple'
                      }`}>
                        {tx.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.98rem' }}>
                      {tx.type === 'transfer_send' ? (
                        <span style={{ color: '#fb7185' }}>-{tx.amount} ATH</span>
                      ) : (
                        <span style={{ color: '#10b981' }}>+{tx.amount} ATH</span>
                      )}
                    </td>
                    <td style={{ color: '#cbd5e1' }}>{tx.counterparty || 'Simulation Gateway'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: '#00f2fe' }}>
                      {tx.txHash ? `${tx.txHash.slice(0, 10)}...${tx.txHash.slice(-6)}` : 'N/A'}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
