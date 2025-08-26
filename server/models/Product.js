const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['import', 'export', 'services', 'logistics', 'documentation'],
    required: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    default: 'Contact for Quotation'
  },
  minOrderQuantity: {
    type: String,
    default: ''
  },
  origin: {
    country: {
      type: String,
      required: true
    },
    region: String
  },
  destination: [{
    country: String,
    region: String
  }],
  images: [{
    url: String,
    alt: String
  }],
  specifications: {
    hsCode: String,
    weight: String,
    dimensions: String,
    packaging: String,
    certifications: [String],
    incoterms: [String]
  },
  availability: {
    type: String,
    enum: ['in-stock', 'made-to-order', 'seasonal', 'out-of-stock'],
    default: 'in-stock'
  },
  leadTime: String,
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  enquiryCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add text search index
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text',
  'origin.country': 'text'
});

// Add compound index for filtering
productSchema.index({ category: 1, status: 1, featured: -1 });
productSchema.index({ 'origin.country': 1, category: 1 });

module.exports = mongoose.model('Product', productSchema);