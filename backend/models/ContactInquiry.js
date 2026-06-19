const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, default: '', trim: true },
  companyName: { type: String, default: '', trim: true },
  website: { type: String, default: '', trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['new', 'in_review', 'resolved'],
    default: 'new',
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);
