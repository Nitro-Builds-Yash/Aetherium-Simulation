import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, User, ArrowRight, Cpu } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.username}`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '3.5rem auto' }} className="aether-card">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: 64,
          height: 64,
          margin: '0 auto 1.2rem',
          borderRadius: 22,
          background: 'linear-gradient(135deg, #9333ea 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 35px rgba(147, 51, 234, 0.5)'
        }}>
          <Cpu size={34} color="#fff" />
        </div>
        <h2 style={{ fontSize: '2.3rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
          AETHERIUM
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.94rem', marginTop: '0.4rem' }}>
          Sign in to your simulated crypto wallet
        </p>
      </div>

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label className="input-label">Username</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-aether btn-crystal" 
          style={{ width: '100%', padding: '1.1rem', fontSize: '1.05rem', marginTop: '0.8rem', borderRadius: '16px' }}
          disabled={loading}
        >
          {loading ? 'Authenticating...' : <>Sign In <ArrowRight size={20} /></>}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.92rem', color: '#94a3b8' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#38bdf8', fontWeight: 800 }}>
          Create Account & Claim 100 ATH
        </Link>
      </div>
    </div>
  );
}
