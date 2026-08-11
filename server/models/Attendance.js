const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  attendanceMethod: { type: String, enum: ['face', 'manual', 'qr'], default: 'face' },
  wifiName: { type: String },
  device: { type: String },
  browser: { type: String },
  ip: { type: String },
  faceVerified: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
