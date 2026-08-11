const Report = require('../models/Notification');

exports.getReports = async (req, res, next) => {
  try {
    const reports = await Report.find();
    res.json({ success: true, data: reports });
  } catch (error) {
    next(error);
  }
};
