const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'customer'],
    default: 'customer'
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    company: String,
    designation: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    avatar: String
  },
  businessInfo: {
    companyType: {
      type: String,
      enum: ['manufacturer', 'trader', 'agent', 'distributor', 'other']
    },
    establishedYear: Number,
    annualRevenue: String,
    employeeCount: String,
    mainProducts: [String],
    mainMarkets: [String],
    certifications: [String],
    website: String
  },
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      whatsapp: {
        type: Boolean,
        default: false
      }
    },
    language: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  permissions: {
    products: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: true },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    enquiries: {
      create: { type: Boolean, default: true },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    users: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Set admin permissions
userSchema.pre('save', function(next) {
  if (this.role === 'admin') {
    this.permissions = {
      products: { create: true, read: true, update: true, delete: true },
      enquiries: { create: true, read: true, update: true, delete: true },
      users: { create: true, read: true, update: true, delete: true }
    };
  } else if (this.role === 'staff') {
    this.permissions = {
      products: { create: true, read: true, update: true, delete: false },
      enquiries: { create: true, read: true, update: true, delete: false },
      users: { create: false, read: true, update: false, delete: false }
    };
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { 
      _id: this._id, 
      email: this.email, 
      role: this.role,
      permissions: this.permissions
    },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-2024',
    { expiresIn: '7d' }
  );
  return token;
};

// Check if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });

module.exports = mongoose.model('User', userSchema);