const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).trim()
];

const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).trim(),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('phone').optional().trim(),
  body('company').optional().trim()
];

// Login endpoint
router.post('/login', validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const db = req.app.locals.db;

  try {
    db.get(
      'SELECT * FROM users WHERE email = ? AND is_active = 1',
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        db.run(
          'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
          [user.id]
        );

        // Generate token
        const token = jwt.sign(
          { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            username: user.username
          },
          process.env.JWT_SECRET || 'your-super-secret-jwt-key-2024',
          { expiresIn: '7d' }
        );

        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            company: user.company,
            isVerified: user.is_verified
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register endpoint
router.post('/register', validateRegister, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, phone, company } = req.body;
  const db = req.app.locals.db;

  try {
    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create username from email
      const username = email.split('@')[0];

      // Insert new user
      db.run(
        `INSERT INTO users (username, email, password, first_name, last_name, phone, company, role) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, email, hashedPassword, firstName, lastName, phone, company, 'customer'],
        function(err) {
          if (err) {
            console.error('Registration error:', err);
            return res.status(500).json({ message: 'Failed to create user' });
          }

          // Generate token
          const token = jwt.sign(
            { 
              id: this.lastID, 
              email: email, 
              role: 'customer',
              username: username
            },
            process.env.JWT_SECRET || 'your-super-secret-jwt-key-2024',
            { expiresIn: '7d' }
          );

          res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
              id: this.lastID,
              email,
              username,
              role: 'customer',
              firstName,
              lastName,
              company
            }
          });
        }
      );
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-2024');
    const db = req.app.locals.db;

    db.get(
      'SELECT id, email, username, role, first_name, last_name, company, is_verified FROM users WHERE id = ?',
      [decoded.id],
      (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: 'Invalid token' });
        }

        res.json({
          valid: true,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            company: user.company,
            isVerified: user.is_verified
          }
        });
      }
    );
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout endpoint (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Password reset request
router.post('/forgot-password', 
  body('email').isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const db = req.app.locals.db;

    db.get('SELECT id, email FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      // Always return success to prevent email enumeration
      res.json({ 
        success: true, 
        message: 'If the email exists, a password reset link has been sent.' 
      });

      if (user) {
        // In production, send actual email with reset link
        console.log(`Password reset requested for: ${email}`);
        // TODO: Implement email sending with nodemailer
      }
    });
});

module.exports = router;