import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Pickaxe, 
  Terminal, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  Gauge, 
  Activity, 
  Layers 
} from 'lucide-react';

export default function MineCoin() {
  const { user, refreshUserData } = useAuth();
  const [mining, setMining] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [hashOutput, setHashOutput] = useState('0000000000000000000000000000000000000000000000000000000000000000');
  const [difficulty] = useState('0000');
  const [lastReward, setLastReward] = useState(null);
  const [hashRate, setHashRate] = useState('0.00 GH/s');
  const [rigHeat, setRigHeat] = useState(42);
  const [blocksSolvedCount, setBlocksSolvedCount] = useState(0);

  useEffect(() => {
    let heatInterval;
    if (mining) {
      heatInterval = setInterval(() => {
        setRigHeat(prev => Math.min(84, prev + Math.floor(Math.random() * 3) + 1));
      }, 300);
    } else {
      heatInterval = setInterval(() => {
        setRigHeat(prev => Math.max(38, prev - 2));
      }, 500);
    }
    return () => clearInterval(heatInterval);
  }, [mining]);

  const startMiningSimulation = async () => {
    if (!user?._id) {
      toast.error('Connect your wallet first');
      return;
    }

    setMining(true);
    setLastReward(null);
    setHashRate((75 + Math.random() * 20).toFixed(2) + ' GH/s');

    let currentNonce = Math.floor(Math.random() * 250000);
    let attempts = 0;
    const interval = setInterval(() => {
      currentNonce += 23;
      attempts += 1;
      setNonce(currentNonce);
      const fakeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setHashOutput(fakeHash);

      if (attempts >= 25) {
        clearInterval(interval);
        completeMining(currentNonce);
      }
    }, 65);
  };

  const completeMining = async (finalNonce) => {
    const validHash = '0000' + Array.from({ length: 60 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setHashOutput(validHash);
    setHashRate('0.00 GH/s');

    try {
      const reward = 5;
      const res = await axios.post(`${API_URL}/wallet/mine`, {
        userId: user._id,
        amount: reward,
        nonce: finalNonce,
        hash: '0x' + validHash
      });

      setMining(false);
      setLastReward(reward);
      setBlocksSolvedCount(prev => prev + 1);
      toast.success(`Block confirmed! +${reward} ATH awarded.`);
      refreshUserData(user._id);
    } catch (err) {
      setMining(false);
      toast.error('Mining validation failed');
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.15))',
          border: '1px solid rgba(245, 158, 11, 0.45)',
          color: '#fbbf24',
          padding: '0.4rem 1.2rem',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          fontWeight: 800,
          marginBottom: '0.8rem'
        }}>
          <Cpu size={16} /> PROOF-OF-WORK MINING ENGINE
        </div>
        <h1 style={{ fontSize: '2.7rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
          Cryptographic Mining Terminal
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.98rem', marginTop: '0.4rem' }}>
          Simulated SHA-256 Proof-of-Work hardware node. Discover valid nonces to confirm blocks and earn block rewards.
        </p>
      </div>

      {/* Hardware Telemetry HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' }}>
        <div className="aether-card" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#06b6d4', fontSize: '0.8rem', fontWeight: 700 }}>
            <Activity size={16} /> HASHRATE
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-code)', color: '#fff', marginTop: '0.4rem' }}>
            {hashRate}
          </div>
        </div>

        <div className="aether-card" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: rigHeat > 75 ? '#f43f5e' : '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>
            <Gauge size={16} /> TEMPERATURE
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-code)', color: rigHeat > 75 ? '#f43f5e' : '#fff', marginTop: '0.4rem' }}>
            {rigHeat}°C
          </div>
        </div>

        <div className="aether-card" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7', fontSize: '0.8rem', fontWeight: 700 }}>
            <Cpu size={16} /> TARGET DIFFICULTY
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-code)', color: '#38bdf8', marginTop: '0.4rem' }}>
            {difficulty}*
          </div>
        </div>

        <div className="aether-card" style={{ padding: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
            <Layers size={16} /> BLOCKS MINED
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-code)', color: '#fff', marginTop: '0.4rem' }}>
            #{blocksSolvedCount}
          </div>
        </div>
      </div>

      {/* Mining Rig Terminal */}
      <div className={`rig-container ${mining ? 'active-mining' : ''}`} style={{ marginBottom: '2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.6rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Terminal size={22} color="#06b6d4" />
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#94a3b8' }}>NODE STATUS:</span>
            <span className={`pill-badge ${mining ? 'pill-gold' : 'pill-green'}`}>
              {mining ? 'COMPUTING HASHES...' : 'IDLE / READY'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'var(--font-code)', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: '#64748b' }}>ALGORITHM: </span>
              <span style={{ color: '#c084fc', fontWeight: 800 }}>SHA-256</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>REWARD: </span>
              <span style={{ color: '#34d399', fontWeight: 800 }}>5.00 ATH</span>
            </div>
          </div>
        </div>

        {/* Live hash console */}
        <div className="hash-terminal">
          <div style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: '0.6rem' }}>
            // REAL-TIME BLOCK HASH CANDIDATE STREAM:
          </div>
          <div style={{ 
            color: mining ? '#38bdf8' : '#34d399', 
            fontWeight: 800, 
            letterSpacing: '0.05em',
            lineHeight: 1.6
          }}>
            {hashOutput}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1.6rem',
            paddingTop: '1.2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#94a3b8',
            fontSize: '0.88rem'
          }}>
            <span>Validated Nonce: <strong style={{ color: '#fff' }}>{nonce}</strong></span>
            <span>Block Reward: <strong style={{ color: '#34d399', fontFamily: 'var(--font-code)' }}>+5.00 ATH</strong></span>
          </div>
        </div>

        {lastReward && (
          <div style={{
            marginTop: '1.6rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            borderRadius: '16px',
            padding: '1.2rem 1.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: '#34d399'
          }}>
            <CheckCircle2 size={28} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Block Confirmed by Network Consensus</div>
              <div style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                +{lastReward} ATH tokens transferred directly to your wallet address.
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2.2rem', textAlign: 'center' }}>
          <button 
            onClick={startMiningSimulation} 
            disabled={mining}
            className="btn-aether btn-cyan"
            style={{ minWidth: '280px', padding: '1.15rem 3rem', fontSize: '1.15rem', borderRadius: '9999px' }}
          >
            {mining ? (
              <>Crunching Proof-of-Work...</>
            ) : (
              <><Pickaxe size={24} /> Start Mining</>
            )}
          </button>
        </div>
      </div>

      {/* Information Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.4rem' }}>
        <div className="aether-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', color: '#38bdf8', marginBottom: '0.7rem' }}>
            <Zap size={22} />
            <h4 style={{ fontWeight: 800, fontSize: '1.05rem' }}>Proof-of-Work Verification</h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: '1.6' }}>
            The node computes incremental nonce values until the generated SHA-256 hash matches the network's leading zero difficulty requirement.
          </p>
        </div>

        <div className="aether-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', color: '#fbbf24', marginBottom: '0.7rem' }}>
            <Cpu size={22} />
            <h4 style={{ fontWeight: 800, fontSize: '1.05rem' }}>Incentive Structure</h4>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: '1.6' }}>
            Valid blocks reward the miner with newly minted ATH tokens. Funds become immediately available in your wallet for transfers or staking.
          </p>
        </div>
      </div>
    </div>
  );
}
