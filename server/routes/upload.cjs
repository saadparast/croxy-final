const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth.cjs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, '../../uploads');
    
    // Determine subfolder based on upload type
    if (req.body.type === 'product') {
      uploadPath = path.join(uploadPath, 'products');
    } else if (req.body.type === 'enquiry') {
      uploadPath = path.join(uploadPath, 'enquiries');
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'image': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    'document': ['application/pdf', 'application/msword', 
                 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                 'application/vnd.ms-excel',
                 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  };

  const uploadType = req.body.uploadType || 'image';
  const allowed = allowedTypes[uploadType] || allowedTypes.image;

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowed.join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload single image
router.post('/image', 
  authMiddleware,
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Build the URL path
    const type = req.body.type || 'general';
    const urlPath = `/uploads/${type === 'product' ? 'products' : type === 'enquiry' ? 'enquiries' : ''}/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: urlPath
      }
    });
  }
);

// Upload multiple images
router.post('/images',
  authMiddleware,
  upload.array('images', 10), // Max 10 images
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const type = req.body.type || 'general';
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/${type === 'product' ? 'products' : type === 'enquiry' ? 'enquiries' : ''}/${file.filename}`
    }));

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      files: uploadedFiles
    });
  }
);

// Upload document
router.post('/document',
  authMiddleware,
  upload.single('document'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const type = req.body.type || 'enquiry';
    const urlPath = `/uploads/${type === 'enquiry' ? 'enquiries' : ''}/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: urlPath
      }
    });
  }
);

// Delete uploaded file
router.delete('/:filename',
  authMiddleware,
  (req, res) => {
    // Only admin and staff can delete files
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { filename } = req.params;
    const { type } = req.query;

    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);
    
    let filePath = path.join(__dirname, '../../uploads');
    if (type === 'product') {
      filePath = path.join(filePath, 'products', safeFilename);
    } else if (type === 'enquiry') {
      filePath = path.join(filePath, 'enquiries', safeFilename);
    } else {
      filePath = path.join(filePath, safeFilename);
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ error: 'Failed to delete file' });
      }

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    });
  }
);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 10 files' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  
  next();
});

module.exports = router;