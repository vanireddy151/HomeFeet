const mongoose = require('mongoose');

const builderContactSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  contactPersonName: {
    type: String,
    default: '',
    trim: true
  },
  mobile: {
    type: String,
    default: '',
    trim: true,
    index: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  website: {
    type: String,
    default: '',
    trim: true
  },
  logoDataUrl: {
    type: String,
    default: ''
  },
  logoFileName: {
    type: String,
    default: '',
    trim: true
  },
  sourceNote: {
    type: String,
    default: 'Official or consented business contact',
    trim: true
  },
  isGenuineContact: {
    type: Boolean,
    default: true
  },
  dailyDigestEnabled: {
    type: Boolean,
    default: false
  },
  lastDigestSentAt: {
    type: Date,
    default: null
  },
  loginUserId: {
    type: String,
    default: '',
    index: true
  },
  loginCreatedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

builderContactSchema.index({ city: 1, companyName: 1 }, { unique: true });

module.exports = mongoose.model('BuilderContact', builderContactSchema);
