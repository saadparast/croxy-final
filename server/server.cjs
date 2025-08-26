require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Import SQLite for backward compatibility
const sqlite3 = require('sqlite3').verbose();

// Import routes
const authRoutes = require('./routes/auth.cjs');
const productRoutes = require('./routes/products.cjs');
const enquiryRoutes = require('./routes/enquiries.cjs');
const adminRoutes = require('./routes/admin.cjs');
const uploadRoutes = require('./routes/upload.cjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Create necessary directories
const uploadsDir = path.join(__dirname, '..', 'uploads');
const productsDir = path.join(uploadsDir, 'products');
const enquiriesDir = path.join(uploadsDir, 'enquiries');

[uploadsDir, productsDir, enquiriesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// SQLite Database setup (keeping for backward compatibility)
const db = new sqlite3.Database('./croxy_exim.db');

// Enhanced SQLite tables
db.serialize(() => {
  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      subcategory TEXT,
      price TEXT,
      min_order_quantity TEXT,
      origin_country TEXT,
      origin_region TEXT,
      images TEXT,
      specifications TEXT,
      availability TEXT DEFAULT 'in-stock',
      lead_time TEXT,
      featured INTEGER DEFAULT 0,
      tags TEXT,
      status TEXT DEFAULT 'active',
      views INTEGER DEFAULT 0,
      enquiry_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Enhanced Inquiries/Enquiries table
  db.run(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      product_name TEXT,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      user_phone TEXT NOT NULL,
      user_company TEXT,
      user_designation TEXT,
      user_country TEXT,
      user_city TEXT,
      enquiry_type TEXT DEFAULT 'product',
      subject TEXT,
      message TEXT NOT NULL,
      quantity TEXT,
      target_price TEXT,
      delivery_port TEXT,
      delivery_terms TEXT,
      payment_terms TEXT,
      attachments TEXT,
      status TEXT DEFAULT 'new',
      priority TEXT DEFAULT 'medium',
      assigned_to INTEGER,
      notes TEXT,
      source TEXT DEFAULT 'website',
      reference_number TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      company TEXT,
      is_active INTEGER DEFAULT 1,
      is_verified INTEGER DEFAULT 0,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create admin user with specified password
  const bcrypt = require('bcryptjs');
  const adminPassword = '707089081@MDsaad';
  
  bcrypt.hash(adminPassword, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing admin password:', err);
      return;
    }
    
    db.run(
      `INSERT OR REPLACE INTO users (id, username, email, password, role, is_active, is_verified) 
       VALUES (1, 'admin', 'admin@croxy-exim.com', ?, 'admin', 1, 1)`,
      [hash],
      (err) => {
        if (err) {
          console.error('Error creating admin user:', err);
        } else {
          console.log('Admin user created/updated successfully');
          console.log('Admin credentials - Username: admin, Password: 707089081@MDsaad');
        }
      }
    );
  });

  // Trade services table
  db.run(`
    CREATE TABLE IF NOT EXISTS trade_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      icon TEXT,
      features TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default trade services
  const defaultServices = [
    {
      name: 'Logistics & Shipping',
      description: 'End-to-end logistics solutions for import/export',
      category: 'logistics',
      features: JSON.stringify(['Sea Freight', 'Air Freight', 'Land Transport', 'Warehousing'])
    },
    {
      name: 'Documentation Services',
      description: 'Complete documentation support for international trade',
      category: 'documentation',
      features: JSON.stringify(['Bill of Lading', 'Certificate of Origin', 'Packing List', 'Commercial Invoice'])
    },
    {
      name: 'Customs Clearance',
      description: 'Expert customs clearance and compliance services',
      category: 'compliance',
      features: JSON.stringify(['Import Clearance', 'Export Clearance', 'Duty Calculation', 'Compliance Advisory'])
    },
    {
      name: 'Trade Finance',
      description: 'Financial solutions for international trade',
      category: 'finance',
      features: JSON.stringify(['Letter of Credit', 'Bank Guarantee', 'Trade Insurance', 'Foreign Exchange'])
    }
  ];

  defaultServices.forEach(service => {
    db.run(
      `INSERT OR IGNORE INTO trade_services (name, description, category, features) VALUES (?, ?, ?, ?)`,
      [service.name, service.description, service.category, service.features]
    );
  });
});

// Make db accessible to routes
app.locals.db = db;

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Trade services endpoint
app.get('/api/services', (req, res) => {
  db.all('SELECT * FROM trade_services WHERE status = ?', ['active'], (err, services) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch services' });
    }
    
    // Parse features JSON
    services = services.map(service => ({
      ...service,
      features: JSON.parse(service.features || '[]')
    }));
    
    res.json(services);
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('Admin credentials - Username: admin, Password: 707089081@MDsaad');
});

module.exports = app;