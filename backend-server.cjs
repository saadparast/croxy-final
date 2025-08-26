const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Database setup
const db = new sqlite3.Database('./croxy_exim.db');

// Create tables
db.serialize(() => {
  // Inquiries table
  db.run(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      country TEXT,
      product_interest TEXT,
      custom_product TEXT,
      quantity TEXT,
      delivery_port TEXT,
      target_price TEXT,
      certifications TEXT,
      message TEXT,
      inquiry_type TEXT DEFAULT 'general',
      status TEXT DEFAULT 'pending',
      source TEXT DEFAULT 'website',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin users table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create default admin user if not exists
  const defaultPassword = '70709081@MDsaad';
  bcrypt.hash(defaultPassword, 10, (err, hash) => {
    if (err) return;
    db.run(
      `INSERT OR IGNORE INTO admin_users (username, password) VALUES (?, ?)`,
      ['admin', hash]
    );
  });

  // Inquiry notes table for admin comments
  db.run(`
    CREATE TABLE IF NOT EXISTS inquiry_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inquiry_id INTEGER,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (inquiry_id) REFERENCES inquiries(id)
    )
  `);
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC allowed.'));
    }
  }
});

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'croxy-exim-secret-key-2024';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// API Routes

// Submit inquiry
app.post('/api/inquiries', (req, res) => {
  const {
    name, email, phone, company, country,
    productInterest, customProduct, quantity,
    deliveryPort, targetPrice, certifications, message,
    inquiryType
  } = req.body;

  const certificationsStr = Array.isArray(certifications) ? certifications.join(', ') : certifications;

  const query = `
    INSERT INTO inquiries (
      name, email, phone, company, country,
      product_interest, custom_product, quantity,
      delivery_port, target_price, certifications,
      message, inquiry_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [name, email, phone, company, country,
     productInterest, customProduct, quantity,
     deliveryPort, targetPrice, certificationsStr,
     message, inquiryType || 'general'],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, error: 'Failed to submit inquiry' });
      }
      
      res.json({ 
        success: true, 
        id: this.lastID,
        message: 'Inquiry submitted successfully' 
      });
    }
  );
});

// Get all inquiries (admin only)
app.get('/api/admin/inquiries', authenticateToken, (req, res) => {
  const query = `
    SELECT * FROM inquiries 
    ORDER BY created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch inquiries' });
    }
    
    res.json({ success: true, data: rows });
  });
});

// Get single inquiry (admin only)
app.get('/api/admin/inquiries/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  const query = `SELECT * FROM inquiries WHERE id = ?`;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch inquiry' });
    }
    
    if (!row) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    
    // Also get notes for this inquiry
    db.all('SELECT * FROM inquiry_notes WHERE inquiry_id = ? ORDER BY created_at DESC', [id], (err, notes) => {
      if (err) {
        console.error('Error fetching notes:', err);
        notes = [];
      }
      
      res.json({ success: true, data: { ...row, notes } });
    });
  });
});

// Update inquiry status (admin only)
app.put('/api/admin/inquiries/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const updateQuery = `
    UPDATE inquiries 
    SET status = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;

  db.run(updateQuery, [status, id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, error: 'Failed to update inquiry' });
    }

    // Add note if provided
    if (note) {
      db.run(
        'INSERT INTO inquiry_notes (inquiry_id, note) VALUES (?, ?)',
        [id, note],
        (err) => {
          if (err) console.error('Error adding note:', err);
        }
      );
    }

    res.json({ success: true, message: 'Inquiry updated successfully' });
  });
});

// Delete inquiry (admin only)
app.delete('/api/admin/inquiries/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM inquiries WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete inquiry' });
    }

    res.json({ success: true, message: 'Inquiry deleted successfully' });
  });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM admin_users WHERE username = ?',
    [username],
    (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, error: 'Login failed' });
      }

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({ 
          success: true, 
          token,
          user: { id: user.id, username: user.username }
        });
      });
    }
  );
});

// Verify token endpoint
app.get('/api/admin/verify', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Get inquiry statistics (admin only)
app.get('/api/admin/statistics', authenticateToken, (req, res) => {
  const queries = {
    total: 'SELECT COUNT(*) as count FROM inquiries',
    pending: "SELECT COUNT(*) as count FROM inquiries WHERE status = 'pending'",
    approved: "SELECT COUNT(*) as count FROM inquiries WHERE status = 'approved'",
    rejected: "SELECT COUNT(*) as count FROM inquiries WHERE status = 'rejected'",
    today: "SELECT COUNT(*) as count FROM inquiries WHERE DATE(created_at) = DATE('now')",
    thisWeek: "SELECT COUNT(*) as count FROM inquiries WHERE DATE(created_at) >= DATE('now', '-7 days')",
    thisMonth: "SELECT COUNT(*) as count FROM inquiries WHERE DATE(created_at) >= DATE('now', 'start of month')"
  };

  const stats = {};
  const promises = Object.entries(queries).map(([key, query]) => {
    return new Promise((resolve) => {
      db.get(query, [], (err, row) => {
        stats[key] = err ? 0 : row.count;
        resolve();
      });
    });
  });

  Promise.all(promises).then(() => {
    res.json({ success: true, data: stats });
  });
});

// Export inquiries as CSV (admin only)
app.get('/api/admin/export', authenticateToken, (req, res) => {
  const query = `SELECT * FROM inquiries ORDER BY created_at DESC`;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, error: 'Failed to export data' });
    }

    // Convert to CSV
    const headers = Object.keys(rows[0] || {}).join(',');
    const csvData = rows.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    ).join('\n');

    const csv = headers + '\n' + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inquiries.csv');
    res.send(csv);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend API server running on http://0.0.0.0:${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});