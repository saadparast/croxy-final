# Backend Setup Guide for Email & Database Integration

## Overview
This guide explains how to set up the backend services for email sending and database storage on Hostinger or any other hosting service.

## 1. Database Setup (MySQL on Hostinger)

### Create Database Tables

```sql
-- Create inquiries table
CREATE TABLE inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  country VARCHAR(100),
  product_interest VARCHAR(255),
  custom_product VARCHAR(500),
  quantity VARCHAR(100),
  delivery_port VARCHAR(255),
  target_price VARCHAR(100),
  certifications TEXT,
  message TEXT,
  inquiry_type ENUM('general', 'product-request') DEFAULT 'general',
  status ENUM('pending', 'contacted', 'completed') DEFAULT 'pending',
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  price VARCHAR(50) DEFAULT 'On Request',
  origin VARCHAR(100),
  min_order VARCHAR(100),
  packaging VARCHAR(255),
  certifications TEXT,
  specifications JSON,
  images JSON,
  manufacturing_process JSON,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create product_images table
CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  image_url VARCHAR(500),
  image_type ENUM('primary', 'gallery', 'certificate') DEFAULT 'gallery',
  caption VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

## 2. Backend API Setup (Node.js/Express)

### Install Dependencies

```bash
npm init -y
npm install express mysql2 nodemailer cors dotenv multer
```

### Create server.js

```javascript
const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Image upload configuration
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// API Endpoints

// Send email and save inquiry
app.post('/api/send-email', async (req, res) => {
  const { template, to, data } = req.body;
  
  try {
    // Save to database
    const query = 'INSERT INTO inquiries SET ?';
    db.query(query, data, (err, result) => {
      if (err) console.error('Database error:', err);
    });
    
    // Send email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: to || 'export@indianharvest.com',
      subject: `New Inquiry: ${data.productName || 'General'}`,
      html: generateEmailTemplate(template, data)
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Inquiry sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save inquiry to database
app.post('/api/inquiries', (req, res) => {
  const query = 'INSERT INTO inquiries SET ?';
  db.query(query, req.body, (err, result) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.json({ success: true, id: result.insertId });
    }
  });
});

// Upload product image
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  // Save to database
  const query = 'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)';
  db.query(query, [req.body.productId, imageUrl], (err, result) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.json({ success: true, imageUrl, id: result.insertId });
    }
  });
});

// Get all inquiries (admin)
app.get('/api/inquiries', (req, res) => {
  const query = 'SELECT * FROM inquiries ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.json({ success: true, data: results });
    }
  });
});

// Email template generator
function generateEmailTemplate(template, data) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>New Inquiry from Website</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>
          <tr><td><strong>Company:</strong></td><td>${data.company || 'N/A'}</td></tr>
          <tr><td><strong>Country:</strong></td><td>${data.country}</td></tr>
          <tr><td><strong>Product:</strong></td><td>${data.productName || data.productInterest}</td></tr>
          <tr><td><strong>Quantity:</strong></td><td>${data.quantity || 'N/A'}</td></tr>
          <tr><td><strong>Message:</strong></td><td>${data.message || 'N/A'}</td></tr>
        </table>
        <p style="margin-top: 20px; color: #666;">
          This inquiry was received on ${new Date().toLocaleString()}
        </p>
      </body>
    </html>
  `;
}

app.listen(process.env.PORT || 3001, () => {
  console.log('Server running on port', process.env.PORT || 3001);
});
```

### Create .env file

```env
# Database Configuration
DB_HOST=your-hostinger-mysql-host
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=your-database-name

# SMTP Configuration (Hostinger Email)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=export@yourdomain.com
SMTP_PASS=your-email-password

# Server Configuration
PORT=3001
```

## 3. Hostinger Deployment

### Step 1: Upload Files
1. Log into Hostinger control panel
2. Navigate to File Manager
3. Create a folder for your API (e.g., `api`)
4. Upload all backend files

### Step 2: Set up Node.js
1. Go to Advanced → Node.js
2. Create new application
3. Set application root to your API folder
4. Set application URL (e.g., api.yourdomain.com)
5. Set application startup file to `server.js`

### Step 3: Configure Environment Variables
1. In Node.js settings, add environment variables
2. Add all variables from .env file

### Step 4: Install Dependencies
1. Use SSH or terminal in control panel
2. Navigate to your API folder
3. Run `npm install`

### Step 5: Start Application
1. Click "Start" in Node.js application manager
2. Check logs for any errors

## 4. Frontend Configuration

Update your React app's environment variables:

```env
REACT_APP_API_URL=https://api.yourdomain.com
```

## 5. Testing

### Test Email Sending
```bash
curl -X POST https://api.yourdomain.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "template": "product-inquiry",
    "to": "test@example.com",
    "data": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+1234567890",
      "productName": "Turmeric Powder",
      "quantity": "500kg",
      "message": "Test inquiry"
    }
  }'
```

### Test Database Save
```bash
curl -X POST https://api.yourdomain.com/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "product_interest": "Spices",
    "inquiry_type": "product-request"
  }'
```

## 6. Security Considerations

1. **Rate Limiting**: Add rate limiting to prevent spam
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});
app.use('/api/send-email', limiter);
```

2. **Input Validation**: Validate all inputs
```javascript
const validator = require('validator');
// Validate email
if (!validator.isEmail(req.body.email)) {
  return res.status(400).json({ error: 'Invalid email' });
}
```

3. **CORS Configuration**: Restrict to your domain
```javascript
app.use(cors({
  origin: 'https://yourdomain.com'
}));
```

4. **SQL Injection Prevention**: Use prepared statements (already implemented with mysql2)

5. **File Upload Security**: Validate file types and sizes
```javascript
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});
```

## 7. Admin Panel (Optional)

Create a simple admin panel to view inquiries:

```javascript
// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Implement secure authentication
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    // Generate JWT token
    res.json({ success: true, token: 'jwt-token-here' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// Protected admin routes
app.get('/api/admin/inquiries', authenticateAdmin, (req, res) => {
  // Return all inquiries
});

app.put('/api/admin/inquiries/:id', authenticateAdmin, (req, res) => {
  // Update inquiry status
});
```

## Support

For issues or questions:
- Email: export@indianharvest.com
- WhatsApp: +91 89760 54993

---

Last Updated: August 2024