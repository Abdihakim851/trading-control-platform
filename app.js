const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'trading-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) console.error(err);
  else console.log('✅ SQLite Database Connected');
});

// Create Tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS trades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      symbol TEXT,
      entry_price REAL,
      exit_price REAL,
      quantity REAL,
      profit REAL,
      pnl_percentage REAL,
      setup_type TEXT,
      confidence INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  console.log('✅ Database tables created');
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET);
      res.json({ message: 'User registered', token, user: { id: this.lastID, name, email } });
    }
  );
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

// Add Trade
app.post('/api/trades', authenticateToken, (req, res) => {
  const { symbol, entry_price, exit_price, quantity, setup_type, confidence } = req.body;
  const profit = (exit_price - entry_price) * quantity;
  const pnl_percentage = ((exit_price - entry_price) / entry_price) * 100;

  db.run(
    'INSERT INTO trades (user_id, symbol, entry_price, exit_price, quantity, profit, pnl_percentage, setup_type, confidence) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, symbol, entry_price, exit_price, quantity, profit, pnl_percentage, setup_type, confidence],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to add trade' });
      res.status(201).json({ message: 'Trade added', trade: { id: this.lastID, symbol, entry_price, exit_price, quantity, profit, pnl_percentage, setup_type, confidence } });
    }
  );
});

// Get Trades
app.get('/api/trades', authenticateToken, (req, res) => {
  db.all('SELECT * FROM trades WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, trades) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch trades' });
    res.json({ trades });
  });
});

// Get Dashboard Analytics
app.get('/api/analytics', authenticateToken, (req, res) => {
  db.all('SELECT * FROM trades WHERE user_id = ?', [req.user.id], (err, trades) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch analytics' });

    if (trades.length === 0) {
      return res.json({
        analytics: {
          totalTrades: 0,
          winningTrades: 0,
          losingTrades: 0,
          totalProfit: 0,
          winRate: 0,
          profitFactor: 0,
          avgWin: 0,
          avgLoss: 0
        }
      });
    }

    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.profit > 0).length;
    const losingTrades = trades.filter(t => t.profit < 0).length;
    const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
    const winRate = (winningTrades / totalTrades) * 100;

    const avgWin = winningTrades > 0 ? trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0) / winningTrades : 0;
    const avgLoss = losingTrades > 0 ? Math.abs(trades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0) / losingTrades) : 0;
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

    res.json({
      analytics: {
        totalTrades,
        winningTrades,
        losingTrades,
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        winRate: parseFloat(winRate.toFixed(2)),
        profitFactor: parseFloat(profitFactor.toFixed(2)),
        avgWin: parseFloat(avgWin.toFixed(2)),
        avgLoss: parseFloat(avgLoss.toFixed(2))
      }
    });
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`💫 Health Check: http://localhost:${PORT}/health\n`);
});
