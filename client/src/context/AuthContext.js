import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const AuthContext = createContext();

export const API_URL = 'http://localhost:5000/api';
export const socket = io('http://localhost:5000', { autoConnect: true });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aetherium_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('aetherium_token') || null);
  const [marketStats, setMarketStats] = useState({
    price: 3.48,
    change24h: '+8.64%',
    history: []
  });

  useEffect(() => {
    if (user?._id) {
      refreshUserData(user._id);
    }
  }, []);

  useEffect(() => {
    socket.on('priceUpdate', (data) => {
      setMarketStats(prev => ({
        ...prev,
        price: data.price,
        history: data.history || prev.history
      }));
    });

    return () => socket.off('priceUpdate');
  }, []);

  const refreshUserData = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/wallet/profile/${userId || user?._id}`);
      if (res.data) {
        const updated = { ...user, ...res.data };
        setUser(updated);
        localStorage.setItem('aetherium_user', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn('Could not refresh user profile:', err.message);
    }
  };

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('aetherium_user', JSON.stringify(userData));
    localStorage.setItem('aetherium_token', jwtToken);
    localStorage.setItem('userId', userData._id);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aetherium_user');
    localStorage.removeItem('aetherium_token');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUserData, marketStats, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
