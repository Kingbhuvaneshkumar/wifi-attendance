const Report = require('../models/Notification');

exports.getReports = async () => {
  return Report.find();
};

exports.createReport = async (payload) => {
  return Report.create(payload);
};
