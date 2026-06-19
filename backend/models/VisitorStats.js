const mongoose = require('mongoose');

const dailyVisitorSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    count: { type: Number, default: 0 },
    uniqueIpHashes: { type: [String], default: [] }
  },
  { _id: false }
);

const visitorStatsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site' },
    totalCount: { type: Number, default: 0 },
    dailyCounts: { type: [dailyVisitorSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('VisitorStats', visitorStatsSchema);
