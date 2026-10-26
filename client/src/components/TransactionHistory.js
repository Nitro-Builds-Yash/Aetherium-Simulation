import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import { History, ExternalLink, Filter } from 'lucide-react';

export default function TransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/transactions/${user._id}`);
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user?._id]);

  const filtered = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type.toLowerCase().includes(filter);
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900 }}>Blockchain Transaction Ledger</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.4rem' }}>
            Permanent, auditable record of all mining, purchases, transfers, and staking operations
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(3, 7, 18, 0.8)', padding: '0.35rem', borderRadius: '14px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
          {['all', 'mine', 'buy', 'transfer', 'stake'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'linear-gradient(135deg, #9333ea, #6366f1)' : 'transparent',
                color: filter === f ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '0.45rem 0.95rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="aether-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            Syncing blockchain records...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            No transaction records found for this filter.
          </div>
        ) : (
          <div className="custom-table-container" style={{ border: 'none' }}>
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
                {filtered.map(tx => (
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
                    <td style={{ fontWeight: 800, fontFamily: 'var(--font-code)' }}>
                      {tx.type === 'transfer_send' ? '-' : '+'}{tx.amount} ATH
                    </td>
                    <td style={{ color: '#cbd5e1' }}>
                      {tx.counterparty || 'Consensus Network'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-code)', fontSize: '0.85rem', color: '#38bdf8' }}>
                      {tx.txHash ? `${tx.txHash.slice(0, 10)}...${tx.txHash.slice(-6)}` : 'N/A'}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.88rem' }}>
                      {new Date(tx.date).toLocaleString()}
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
