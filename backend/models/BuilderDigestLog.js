const mongoose = require('mongoose');

const builderDigestLogSchema = new mongoose.Schema({
  builderContact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuilderContact',
    required: true,
    index: true
  },
  city: {
    type: String,
    default: 'Hyderabad',
    trim: true,
    index: true
  },
  period: {
    type: String,
    enum: ['morning', 'evening', 'manual'],
    default: 'manual',
    index: true
  },
  propertyIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  sentAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  status: {
    type: String,
    enum: ['sent', 'skipped', 'failed', 'dry_run'],
    default: 'sent',
    index: true
  },
  providerMessageId: {
    type: String,
    default: '',
    trim: true
  },
  error: {
    type: String,
    default: '',
    trim: true
  },
  messagePreview: {
    type: String,
    default: '',
    trim: true
  }
}, { timestamps: true });

builderDigestLogSchema.index({ builderContact: 1, sentAt: 1 });
builderDigestLogSchema.index({ city: 1, sentAt: 1 });

module.exports = mongoose.model('BuilderDigestLog', builderDigestLogSchema);
