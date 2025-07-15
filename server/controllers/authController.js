const bcrypt = require('bcryptjs');
const { createUser, findUserByUsername } = require('../models/user');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'All fields required' });
  // Password must have at least one uppercase letter, one special character, and one number
  const uppercasePattern = /[A-Z]/;
  const specialCharPattern = /[^A-Za-z0-9]/;
  const numberPattern = /[0-9]/;
  if (!uppercasePattern.test(password) || !specialCharPattern.test(password) || !numberPattern.test(password)) {
    return res.status(400).json({ message: 'Password must contain at least one uppercase letter, one number, and one special character.' });
  }
  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) return res.status(409).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, hashedPassword);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'All fields required' });
  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
