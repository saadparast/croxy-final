const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  productName: String,
  user: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    company: String,
    designation: String,
    country: String,
    city: String
  },
  enquiryType: {
    type: String,
    enum: ['product', 'service', 'partnership', 'general', 'quote', 'bulk'],
    default: 'product'
  },
  subject: String,
  message: {
    type: String,
    required: true
  },
  specifications: {
    quantity: String,
    targetPrice: String,
    deliveryPort: String,
    deliveryTerms: String,
    paymentTerms: String,
    requiredCertifications: [String],
    preferredShippingMethod: String,
    expectedDeliveryDate: Date
  },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String
  }],
  status: {
    type: String,
    enum: ['new', 'in-progress', 'responded', 'quoted', 'negotiating', 'closed', 'cancelled'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    text: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  quote: {
    amount: Number,
    currency: String,
    validUntil: Date,
    terms: String,
    sentAt: Date
  },
  source: {
    type: String,
    enum: ['website', 'email', 'phone', 'whatsapp', 'exhibition', 'referral'],
    default: 'website'
  },
  referenceNumber: {
    type: String,
    unique: true
  },
  responseTime: Date,
  closedAt: Date,
  rating: {
    score: Number,
    feedback: String
  }
}, {
  timestamps: true
});

// Generate reference number before saving
enquirySchema.pre('save', async function(next) {
  if (!this.referenceNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.referenceNumber = `ENQ${year}${month}${random}`;
  }
  next();
});

// Add indexes
enquirySchema.index({ 'user.email': 1, status: 1 });
enquirySchema.index({ referenceNumber: 1 });
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ product: 1, status: 1 });

module.exports = mongoose.model('Enquiry', enquirySchema);