const Attendance = require('../models/Attendance');

exports.createAttendance = async (data) => {
  const att = await Attendance.create(data);
  return att;
};

exports.getAll = async () => {
  return Attendance.find();
};
