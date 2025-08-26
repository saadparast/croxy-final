const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth.cjs');
const sendEmail = require('../utils/email.cjs');

// Generate reference number
function generateReferenceNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ENQ${year}${month}${random}`;
}

// Submit enquiry
router.post('/',
  [
    body('userName').notEmpty().trim(),
    body('userEmail').isEmail().normalizeEmail(),
    body('userPhone').notEmpty().trim(),
    body('message').notEmpty().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = req.app.locals.db;
    const {
      productId,
      productName,
      userName,
      userEmail,
      userPhone,
      userCompany,
      userDesignation,
      userCountry,
      userCity,
      enquiryType,
      subject,
      message,
      quantity,
      targetPrice,
      deliveryPort,
      deliveryTerms,
      paymentTerms
    } = req.body;

    const referenceNumber = generateReferenceNumber();

    db.run(
      `INSERT INTO enquiries (
        product_id, product_name, user_name, user_email, user_phone,
        user_company, user_designation, user_country, user_city,
        enquiry_type, subject, message, quantity, target_price,
        delivery_port, delivery_terms, payment_terms, reference_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId || null,
        productName || '',
        userName,
        userEmail,
        userPhone,
        userCompany || '',
        userDesignation || '',
        userCountry || '',
        userCity || '',
        enquiryType || 'product',
        subject || 'Product Enquiry',
        message,
        quantity || '',
        targetPrice || '',
        deliveryPort || '',
        deliveryTerms || '',
        paymentTerms || '',
        referenceNumber
      ],
      async function(err) {
        if (err) {
          console.error('Error creating enquiry:', err);
          return res.status(500).json({ error: 'Failed to submit enquiry' });
        }

        // Update product enquiry count if product ID provided
        if (productId) {
          db.run('UPDATE products SET enquiry_count = enquiry_count + 1 WHERE id = ?', [productId]);
        }

        // Send email notification to admin
        try {
          const emailContent = `
            <h2>New Enquiry Received</h2>
            <p><strong>Reference:</strong> ${referenceNumber}</p>
            <p><strong>From:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Phone:</strong> ${userPhone}</p>
            <p><strong>Company:</strong> ${userCompany || 'N/A'}</p>
            <p><strong>Country:</strong> ${userCountry || 'N/A'}</p>
            ${productName ? `<p><strong>Product:</strong> ${productName}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            ${quantity ? `<p><strong>Quantity:</strong> ${quantity}</p>` : ''}
            ${targetPrice ? `<p><strong>Target Price:</strong> ${targetPrice}</p>` : ''}
          `;

          await sendEmail({
            to: process.env.ADMIN_EMAIL || 'admin@croxy-exim.com',
            subject: `New Enquiry - ${referenceNumber}`,
            html: emailContent
          });

          // Send confirmation to user
          const userEmailContent = `
            <h2>Thank you for your enquiry</h2>
            <p>Dear ${userName},</p>
            <p>We have received your enquiry and will respond within 24 hours.</p>
            <p><strong>Your reference number:</strong> ${referenceNumber}</p>
            <p>Please use this reference number for any future correspondence.</p>
            <br>
            <p>Best regards,<br>Croxy Export Import Team</p>
          `;

          await sendEmail({
            to: userEmail,
            subject: `Enquiry Confirmation - ${referenceNumber}`,
            html: userEmailContent
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          // Don't fail the request if email fails
        }

        res.status(201).json({
          success: true,
          message: 'Enquiry submitted successfully',
          referenceNumber,
          enquiryId: this.lastID
        });
      }
    );
  }
);

// Get user's enquiries
router.get('/my-enquiries',
  authMiddleware,
  async (req, res) => {
    const db = req.app.locals.db;
    const userEmail = req.user.email;

    db.all(
      `SELECT * FROM enquiries 
       WHERE user_email = ? 
       ORDER BY created_at DESC`,
      [userEmail],
      (err, enquiries) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch enquiries' });
        }

        res.json(enquiries);
      }
    );
  }
);

// Get all enquiries (admin only)
router.get('/',
  authMiddleware,
  async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const db = req.app.locals.db;
    const { status, priority, limit = 50, offset = 0 } = req.query;

    let sql = 'SELECT * FROM enquiries WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (priority) {
      sql += ' AND priority = ?';
      params.push(priority);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    db.all(sql, params, (err, enquiries) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch enquiries' });
      }

      // Get total count
      let countSql = 'SELECT COUNT(*) as total FROM enquiries WHERE 1=1';
      const countParams = params.slice(0, -2);

      db.get(countSql, countParams, (err, count) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to get enquiry count' });
        }

        res.json({
          enquiries,
          total: count.total,
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
      });
    });
  }
);

// Get single enquiry
router.get('/:id',
  authMiddleware,
  async (req, res) => {
    const db = req.app.locals.db;
    const { id } = req.params;

    db.get('SELECT * FROM enquiries WHERE id = ?', [id], (err, enquiry) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch enquiry' });
      }

      if (!enquiry) {
        return res.status(404).json({ error: 'Enquiry not found' });
      }

      // Check authorization
      if (req.user.role !== 'admin' && req.user.role !== 'staff' && enquiry.user_email !== req.user.email) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Parse notes if exists
      if (enquiry.notes) {
        try {
          enquiry.notes = JSON.parse(enquiry.notes);
        } catch (e) {
          enquiry.notes = [];
        }
      }

      res.json(enquiry);
    });
  }
);

// Update enquiry status (admin only)
router.patch('/:id/status',
  authMiddleware,
  body('status').isIn(['new', 'in-progress', 'responded', 'quoted', 'negotiating', 'closed', 'cancelled']),
  async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = req.app.locals.db;
    const { id } = req.params;
    const { status, note } = req.body;

    db.get('SELECT * FROM enquiries WHERE id = ?', [id], (err, enquiry) => {
      if (err || !enquiry) {
        return res.status(404).json({ error: 'Enquiry not found' });
      }

      let notes = [];
      try {
        notes = JSON.parse(enquiry.notes || '[]');
      } catch (e) {
        notes = [];
      }

      if (note) {
        notes.push({
          text: note,
          createdBy: req.user.username,
          createdAt: new Date().toISOString()
        });
      }

      db.run(
        'UPDATE enquiries SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, JSON.stringify(notes), id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to update enquiry' });
          }

          res.json({
            success: true,
            message: 'Enquiry status updated successfully'
          });
        }
      );
    });
  }
);

// Add note to enquiry (admin only)
router.post('/:id/notes',
  authMiddleware,
  body('note').notEmpty(),
  async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = req.app.locals.db;
    const { id } = req.params;
    const { note } = req.body;

    db.get('SELECT notes FROM enquiries WHERE id = ?', [id], (err, enquiry) => {
      if (err || !enquiry) {
        return res.status(404).json({ error: 'Enquiry not found' });
      }

      let notes = [];
      try {
        notes = JSON.parse(enquiry.notes || '[]');
      } catch (e) {
        notes = [];
      }

      notes.push({
        text: note,
        createdBy: req.user.username,
        createdAt: new Date().toISOString()
      });

      db.run(
        'UPDATE enquiries SET notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [JSON.stringify(notes), id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to add note' });
          }

          res.json({
            success: true,
            message: 'Note added successfully'
          });
        }
      );
    });
  }
);

// Delete enquiry (admin only)
router.delete('/:id',
  authMiddleware,
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const db = req.app.locals.db;
    const { id } = req.params;

    db.run('DELETE FROM enquiries WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete enquiry' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Enquiry not found' });
      }

      res.json({
        success: true,
        message: 'Enquiry deleted successfully'
      });
    });
  }
);

module.exports = router;