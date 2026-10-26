const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transactions', transactionRoutes);

// Market Simulation Engine
let currentPrice = 1.25;
const priceHistory = [
  { time: '10:00', price: 1.15 },
  { time: '10:05', price: 1.18 },
  { time: '10:10', price: 1.22 },
  { time: '10:15', price: 1.20 },
  { time: '10:20', price: 1.25 }
];

app.get('/api/market/stats', (req, res) => {
  res.json({
    symbol: 'ATH',
    name: 'Aetherium Token',
    price: parseFloat(currentPrice.toFixed(4)),
    change24h: '+4.8%',
    marketCap: '$1,250,000',
    volume24h: '$84,320',
    history: priceHistory
  });
});

// Periodic simulated price movement every 8 seconds
setInterval(() => {
  const delta = (Math.random() - 0.48) * 0.05; // slight upward drift
  currentPrice = Math.max(0.1, currentPrice + delta);
  
  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
  priceHistory.push({ time: timeStr, price: parseFloat(currentPrice.toFixed(4)) });
  if (priceHistory.length > 20) priceHistory.shift();

  io.emit('priceUpdate', {
    price: parseFloat(currentPrice.toFixed(4)),
    history: priceHistory
  });
}, 8000);

io.on('connection', (socket) => {
  socket.emit('priceUpdate', {
    price: parseFloat(currentPrice.toFixed(4)),
    history: priceHistory
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crypto_simulation';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected to Aetherium database');
    server.listen(PORT, () => console.log(`Aetherium server active on port ${PORT}`));
  })
  .catch((err) => {
    console.warn('MongoDB connection error (check if MongoDB is running locally):', err.message);
    // Still listen for API requests even if mongo is offline so frontend preview works
    server.listen(PORT, () => console.log(`Server running in standalone mode on port ${PORT}`));
  });
