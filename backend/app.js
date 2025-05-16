const express = require('express');
const app = express(); // <-- Tambahkan ini
const routes = require('./routes');

// Middleware dan konfigurasi lainnya
app.use(express.json());
app.use(cors());

// Routes
app.use('/', routes);

// Export app untuk digunakan di server.js
module.exports = app;