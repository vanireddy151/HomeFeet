const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  role: {
    type: String,
    enum: ['Builder', 'Owner', 'Mediator', 'Buyer', 'Land Seeker', 'Other'],
    default: 'Owner',
    index: true
  },
  city: { type: String, default: '', trim: true, maxlength: 80 },
  summary: { type: String, required: true, trim: true, maxlength: 800 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'hidden'],
    default: 'pending',
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
