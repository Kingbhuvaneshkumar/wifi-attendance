const mongoose = require('mongoose');

const WiFiConfigSchema = new mongoose.Schema({
  ssid: { type: String, required: true, unique: true },
  bssid: { type: String },
  allowedIpPrefix: { type: String, default: '192.168.' },
  department: { type: String, default: 'Computer Science' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WiFiConfig', WiFiConfigSchema);
