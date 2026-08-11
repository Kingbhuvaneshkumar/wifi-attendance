const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  department: { type: String },
  teacherName: { type: String },
});

module.exports = mongoose.model('Subject', SubjectSchema);
