import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import MineCoin from './components/MineCoin';
import BuyCoin from './components/BuyCoin';
import TransferCoin from './components/TransferCoin';
import StakingVault from './components/StakingVault';
import TransactionHistory from './components/TransactionHistory';
import Leaderboard from './components/Leaderboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/mine" element={
            <ProtectedRoute>
              <MineCoin />
            </ProtectedRoute>
          } />
          
          <Route path="/buy" element={
            <ProtectedRoute>
              <BuyCoin />
            </ProtectedRoute>
          } />

          <Route path="/transfer" element={
            <ProtectedRoute>
              <TransferCoin />
            </ProtectedRoute>
          } />

          <Route path="/stake" element={
            <ProtectedRoute>
              <StakingVault />
            </ProtectedRoute>
          } />
          
          <Route path="/history" element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          } />

          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px'
            }
          }}
        />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
