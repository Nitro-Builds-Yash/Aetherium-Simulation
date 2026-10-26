import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Cpu, 
  Pickaxe, 
  ShoppingBag, 
  Send, 
  History, 
  Trophy, 
  Layers, 
  LogOut, 
  LayoutDashboard,
  CircleDot
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, marketStats } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="brand-wrapper">
        <div className="crystal-crest">
          <Cpu size={22} />
        </div>
        <div>
          <div className="brand-title">AETHERIUM</div>
          <div className="brand-badge">PROTOCOL // V2.4</div>
        </div>
      </Link>

      {user ? (
        <>
          <div className="nav-menu">
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link to="/mine" className={`nav-link ${isActive('/mine')}`}>
              <Pickaxe size={16} /> Mining
            </Link>
            <Link to="/buy" className={`nav-link ${isActive('/buy')}`}>
              <ShoppingBag size={16} /> Buy
            </Link>
            <Link to="/transfer" className={`nav-link ${isActive('/transfer')}`}>
              <Send size={16} /> Transfer
            </Link>
            <Link to="/stake" className={`nav-link ${isActive('/stake')}`}>
              <Layers size={16} /> Staking
            </Link>
            <Link to="/history" className={`nav-link ${isActive('/history')}`}>
              <History size={16} /> Ledger
            </Link>
            <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard')}`}>
              <Trophy size={16} /> Leaderboard
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Live Ticker */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(13, 20, 41, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '9999px',
              padding: '0.4rem 0.95rem',
              fontSize: '0.85rem'
            }}>
              <CircleDot size={10} color="#10b981" />
              <span style={{ color: '#94a3b8' }}>ATH/USD</span>
              <span style={{ fontFamily: 'var(--font-code)', fontWeight: 700, color: '#38bdf8' }}>
                ${marketStats.price.toFixed(4)}
              </span>
            </div>

            {/* Balance Pill */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.25), rgba(6, 182, 212, 0.2))',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '9999px',
              padding: '0.4rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 600 }}>Balance:</span>
              <span style={{ 
                fontFamily: 'var(--font-code)', 
                fontWeight: 800, 
                color: '#34d399', 
                fontSize: '0.96rem' 
              }}>
                {user.balance?.toLocaleString() || 0} ATH
              </span>
            </div>

            <button 
              onClick={handleLogout} 
              className="btn-aether btn-ghost" 
              style={{ padding: '0.5rem 0.85rem', borderRadius: '9999px' }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" className="btn-aether btn-ghost" style={{ padding: '0.6rem 1.3rem', borderRadius: '9999px' }}>
            Sign In
          </Link>
          <Link to="/signup" className="btn-aether btn-crystal" style={{ padding: '0.6rem 1.5rem', borderRadius: '9999px' }}>
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
