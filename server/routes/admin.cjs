const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.cjs');

// Admin dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const db = req.app.locals.db;

  try {
    // Get various statistics
    const stats = await new Promise((resolve, reject) => {
      const result = {};

      // Total products
      db.get('SELECT COUNT(*) as total FROM products WHERE status = "active"', (err, row) => {
        if (err) return reject(err);
        result.totalProducts = row.total;

        // Total enquiries
        db.get('SELECT COUNT(*) as total FROM enquiries', (err, row) => {
          if (err) return reject(err);
          result.totalEnquiries = row.total;

          // New enquiries (last 7 days)
          db.get(
            `SELECT COUNT(*) as total FROM enquiries 
             WHERE created_at >= datetime('now', '-7 days')`,
            (err, row) => {
              if (err) return reject(err);
              result.newEnquiries = row.total;

              // Total users
              db.get('SELECT COUNT(*) as total FROM users WHERE role = "customer"', (err, row) => {
                if (err) return reject(err);
                result.totalUsers = row.total;

                // Enquiries by status
                db.all(
                  'SELECT status, COUNT(*) as count FROM enquiries GROUP BY status',
                  (err, rows) => {
                    if (err) return reject(err);
                    result.enquiriesByStatus = rows;

                    // Products by category
                    db.all(
                      'SELECT category, COUNT(*) as count FROM products WHERE status = "active" GROUP BY category',
                      (err, rows) => {
                        if (err) return reject(err);
                        result.productsByCategory = rows;

                        // Recent enquiries
                        db.all(
                          `SELECT id, reference_number, user_name, user_email, 
                           product_name, status, created_at 
                           FROM enquiries 
                           ORDER BY created_at DESC 
                           LIMIT 10`,
                          (err, rows) => {
                            if (err) return reject(err);
                            result.recentEnquiries = rows;

                            // Top products by enquiries
                            db.all(
                              `SELECT p.id, p.name, p.category, p.enquiry_count 
                               FROM products p 
                               WHERE p.status = "active" 
                               ORDER BY p.enquiry_count DESC 
                               LIMIT 5`,
                              (err, rows) => {
                                if (err) return reject(err);
                                result.topProducts = rows;

                                resolve(result);
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              });
            }
          );
        });
      });
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all users (admin only)
router.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const db = req.app.locals.db;
  const { role, isActive, limit = 50, offset = 0 } = req.query;

  let sql = 'SELECT id, username, email, role, first_name, last_name, company, is_active, is_verified, last_login, created_at FROM users WHERE 1=1';
  const params = [];

  if (role) {
    sql += ' AND role = ?';
    params.push(role);
  }

  if (isActive !== undefined) {
    sql += ' AND is_active = ?';
    params.push(isActive === 'true' ? 1 : 0);
  }

  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(sql, params, (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const countParams = params.slice(0, -2);

    db.get(countSql, countParams, (err, count) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to get user count' });
      }

      res.json({
        users,
        total: count.total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    });
  });
});

// Update user status (admin only)
router.patch('/users/:id/status', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const db = req.app.locals.db;
  const { id } = req.params;
  const { isActive } = req.body;

  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'Cannot modify your own status' });
  }

  db.run(
    'UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [isActive ? 1 : 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update user status' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        message: 'User status updated successfully'
      });
    }
  );
});

// Update user role (admin only)
router.patch('/users/:id/role', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const db = req.app.locals.db;
  const { id } = req.params;
  const { role } = req.body;

  if (!['customer', 'staff', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  if (parseInt(id) === req.user.id && role !== 'admin') {
    return res.status(400).json({ error: 'Cannot remove your own admin role' });
  }

  db.run(
    'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [role, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update user role' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        message: 'User role updated successfully'
      });
    }
  );
});

// Export enquiries as CSV
router.get('/export/enquiries', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const db = req.app.locals.db;
  const { startDate, endDate, status } = req.query;

  let sql = 'SELECT * FROM enquiries WHERE 1=1';
  const params = [];

  if (startDate) {
    sql += ' AND created_at >= ?';
    params.push(startDate);
  }

  if (endDate) {
    sql += ' AND created_at <= ?';
    params.push(endDate);
  }

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY created_at DESC';

  db.all(sql, params, (err, enquiries) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to export enquiries' });
    }

    // Convert to CSV
    const csv = convertToCSV(enquiries);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="enquiries.csv"');
    res.send(csv);
  });
});

// Helper function to convert to CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');

  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(value || '').replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    }).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

module.exports = router;