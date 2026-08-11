const Subject = require('../models/Subject');

exports.getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find();
    res.json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
};

exports.createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};
