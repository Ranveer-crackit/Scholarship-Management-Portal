const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!['student', 'institution'].includes(role)) {
    return res.status(400).json({ message: "Only student or institution can sign up" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;

  db.query(query, [name, email, hashedPassword, role], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.status(201).json({ message: "Registered successfully" });
  });
};

exports.signin = (req, res) => {
  const { email, password, role } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND role = ?`;
  db.query(query, [email, role], async (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });

    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token, role: user.role });
  });
};
