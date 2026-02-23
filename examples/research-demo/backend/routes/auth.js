const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-production';
const TOKEN_EXPIRY = '24h';

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const hash = crypto.createHash('sha256').update(password).digest('hex');
  if (hash !== user.password_hash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username }
  });
});

module.exports = router;
