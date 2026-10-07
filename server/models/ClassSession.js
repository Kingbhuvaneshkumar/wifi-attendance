const mongoose = require('mongoose');

const ClassSessionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facultyName: { type: String },
  code: { type: String, required: true },
  allowedWifiSSID: { type: String, default: 'RMK-CAMPUS' },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
});

module.exports = mongoose.model('ClassSession', ClassSessionSchema);
