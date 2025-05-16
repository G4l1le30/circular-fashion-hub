require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost', 'http://127.0.0.1'], 
  credentials: true
}));

app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fashiondb',
  port: process.env.DB_PORT || 3306
});

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Test koneksi
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
  connection.release();
});

// Routes
app.get('/', (req, res) => {
  res.send('Circular Fashion Hub API');
});

// Register Endpoint
app.post('/register', async (req, res) => {
  
  const { username, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Simpan ke database
    pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (error, results) => {
        if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username/email sudah terdaftar' });
          }
          console.error(error);
          return res.status(500).json({ error: 'Server error' });
        }
        
        // Generate token
        const token = jwt.sign({ id: results.insertId }, JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ 
          message: 'Registrasi berhasil',
          userId: results.insertId,
          token 
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ error: 'Email atau password salah' });
      }
      
      const user = results[0];
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Email atau password salah' });
      }
      
      // Generate token
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      
      res.json({
        message: 'Login berhasil',
        userId: user.id,
        username: user.username,
        token
      });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});