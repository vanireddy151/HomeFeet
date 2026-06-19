const mongoose = require('mongoose');

const whatsAppIntakeSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['webhook', 'manual'],
    default: 'manual',
    index: true
  },
  ownerPhone: {
    type: String,
    default: '',
    index: true
  },
  ownerName: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    required: true
  },
  parsed: {
    type: Object,
    default: {}
  },
  mediaIds: {
    type: [String],
    default: []
  },
  mediaUrls: {
    type: [String],
    default: []
  },
  whatsappMessageId: {
    type: String,
    default: '',
    index: true
  },
  propertyId: {
    type: String,
    default: '',
    index: true
  },
  intakePeriod: {
    type: String,
    enum: ['morning', 'evening'],
    default: 'morning',
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'converted', 'ignored'],
    default: 'pending',
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WhatsAppIntake', whatsAppIntakeSchema);
