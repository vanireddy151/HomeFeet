const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  createdAt: { type: Date, default: Date.now }
});

shortlistSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);
