const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  interestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Interest', required: true, index: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
  senderId: { type: String, required: true, index: true },
  recipientId: { type: String, required: true, index: true },
  body: { type: String, required: true, trim: true },
  readAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
