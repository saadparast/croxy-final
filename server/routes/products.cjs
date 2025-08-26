const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const authMiddleware = require('../middleware/auth.cjs');

// Get all products with filters
router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  const { 
    category, 
    country, 
    search, 
    featured, 
    limit = 20, 
    offset = 0,
    sort = 'created_at',
    order = 'DESC'
  } = req.query;

  let sql = 'SELECT * FROM products WHERE status = "active"';
  const params = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (country) {
    sql += ' AND origin_country = ?';
    params.push(country);
  }

  if (featured === 'true') {
    sql += ' AND featured = 1';
  }

  if (search) {
    sql += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  // Add sorting
  const validSortFields = ['created_at', 'name', 'views', 'enquiry_count'];
  const sortField = validSortFields.includes(sort) ? sort : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  sql += ` ORDER BY ${sortField} ${sortOrder}`;

  // Add pagination
  sql += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(sql, params, (err, products) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    // Parse JSON fields
    products = products.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      specifications: JSON.parse(product.specifications || '{}'),
      tags: JSON.parse(product.tags || '[]')
    }));

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM products WHERE status = "active"';
    const countParams = params.slice(0, -2); // Remove limit and offset

    db.get(countSql, countParams, (err, count) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to get product count' });
      }

      res.json({
        products,
        total: count.total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    });
  });
});

// Get single product
router.get('/:id', (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  db.get('SELECT * FROM products WHERE id = ? AND status = "active"', [id], (err, product) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch product' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Increment view count
    db.run('UPDATE products SET views = views + 1 WHERE id = ?', [id]);

    // Parse JSON fields
    product.images = JSON.parse(product.images || '[]');
    product.specifications = JSON.parse(product.specifications || '{}');
    product.tags = JSON.parse(product.tags || '[]');

    // Get related products
    db.all(
      'SELECT id, name, images, price, origin_country FROM products WHERE category = ? AND id != ? LIMIT 4',
      [product.category, id],
      (err, related) => {
        if (related) {
          related = related.map(p => ({
            ...p,
            images: JSON.parse(p.images || '[]')
          }));
        }

        res.json({
          ...product,
          relatedProducts: related || []
        });
      }
    );
  });
});

// Create product (admin only)
router.post('/', 
  authMiddleware,
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('category').isIn(['import', 'export', 'services', 'logistics', 'documentation']),
    body('origin_country').notEmpty().trim()
  ],
  async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = req.app.locals.db;
    const {
      name,
      description,
      category,
      subcategory,
      price,
      min_order_quantity,
      origin_country,
      origin_region,
      images,
      specifications,
      availability,
      lead_time,
      featured,
      tags
    } = req.body;

    db.run(
      `INSERT INTO products (
        name, description, category, subcategory, price, min_order_quantity,
        origin_country, origin_region, images, specifications, availability,
        lead_time, featured, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        category,
        subcategory || '',
        price || 'Contact for Quotation',
        min_order_quantity || '',
        origin_country,
        origin_region || '',
        JSON.stringify(images || []),
        JSON.stringify(specifications || {}),
        availability || 'in-stock',
        lead_time || '',
        featured ? 1 : 0,
        JSON.stringify(tags || [])
      ],
      function(err) {
        if (err) {
          console.error('Error creating product:', err);
          return res.status(500).json({ error: 'Failed to create product' });
        }

        res.status(201).json({
          success: true,
          message: 'Product created successfully',
          productId: this.lastID
        });
      }
    );
  }
);

// Update product (admin only)
router.put('/:id',
  authMiddleware,
  async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const db = req.app.locals.db;
    const { id } = req.params;
    const updates = req.body;

    // Build update query dynamically
    const updateFields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        
        // Handle JSON fields
        if (['images', 'specifications', 'tags'].includes(key)) {
          values.push(JSON.stringify(updates[key]));
        } else if (key === 'featured') {
          values.push(updates[key] ? 1 : 0);
        } else {
          values.push(updates[key]);
        }
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const sql = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;

    db.run(sql, values, function(err) {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'Failed to update product' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({
        success: true,
        message: 'Product updated successfully'
      });
    });
  }
);

// Delete product (admin only)
router.delete('/:id',
  authMiddleware,
  async (req, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const db = req.app.locals.db;
    const { id } = req.params;

    // Soft delete by setting status to inactive
    db.run(
      'UPDATE products SET status = "inactive", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete product' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
          success: true,
          message: 'Product deleted successfully'
        });
      }
    );
  }
);

// Get featured products
router.get('/featured/list', (req, res) => {
  const db = req.app.locals.db;

  db.all(
    'SELECT * FROM products WHERE featured = 1 AND status = "active" ORDER BY created_at DESC LIMIT 8',
    [],
    (err, products) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch featured products' });
      }

      products = products.map(product => ({
        ...product,
        images: JSON.parse(product.images || '[]'),
        specifications: JSON.parse(product.specifications || '{}'),
        tags: JSON.parse(product.tags || '[]')
      }));

      res.json(products);
    }
  );
});

// Get product categories with counts
router.get('/categories/stats', (req, res) => {
  const db = req.app.locals.db;

  db.all(
    `SELECT category, COUNT(*) as count 
     FROM products 
     WHERE status = "active" 
     GROUP BY category`,
    [],
    (err, categories) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch categories' });
      }

      res.json(categories);
    }
  );
});

module.exports = router;