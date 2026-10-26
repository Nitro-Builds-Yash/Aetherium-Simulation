import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/auth/signup`, { username, password });
      login(res.data.user, res.data.token);
      toast.success('Account created! 100 ATH welcome bonus credited');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '3rem auto' }} className="aether-card">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: 64,
          height: 64,
          margin: '0 auto 1.2rem',
          borderRadius: 22,
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 35px rgba(16, 185, 129, 0.45)'
        }}>
          <UserPlus size={34} color="#fff" />
        </div>
        <h2 style={{ fontSize: '2.3rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
          Create Account
        </h2>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.45rem', 
          background: 'rgba(16, 185, 129, 0.18)', 
          color: '#34d399', 
          padding: '0.4rem 0.95rem', 
          borderRadius: '9999px', 
          fontSize: '0.82rem', 
          fontWeight: 800, 
          marginTop: '0.7rem' 
        }}>
          <CheckCircle2 size={16} /> 100 ATH BONUS INCLUDED
        </div>
      </div>

      <form onSubmit={handleSignup}>
        <div className="input-group">
          <label className="input-label">Username</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Choose username"
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
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Confirm Password</label>
          <input 
            type="password" 
            className="form-input" 
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-aether btn-emerald" 
          style={{ width: '100%', padding: '1.1rem', fontSize: '1.05rem', marginTop: '0.8rem', borderRadius: '16px' }}
          disabled={loading}
        >
          {loading ? 'Creating Wallet...' : <>Claim 100 ATH & Register <ArrowRight size={20} /></>}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.92rem', color: '#94a3b8' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#34d399', fontWeight: 800 }}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
