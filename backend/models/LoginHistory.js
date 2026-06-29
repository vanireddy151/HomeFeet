const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  accountType: {
    type: String,
    default: 'owner'
  },
  method: {
    type: String,
    enum: ['otp', 'email_password'],
    required: true
  },
  ip: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  loggedInAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

loginHistorySchema.index({ userId: 1, loggedInAt: -1 });

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
