const Attendance = require('../models/Attendance');
const wifiService = require('../services/wifiService');
const faceRecognition = require('../services/faceRecognition');

exports.logAttendance = async (req, res, next) => {
  try {
    const { subject, attendanceMethod = 'face', wifiName, device, browser } = req.body;
    let { faceEmbedding, faceImage } = req.body;

    if (!subject) {
      return res.status(400).json({ success: false, message: 'Subject is required' });
    }

    const ip = wifiService.getClientIp(req);
    const isCollegeNetwork = wifiService.isCollegeNetwork(ip);
    if (!isCollegeNetwork) {
      return res.status(403).json({ success: false, message: 'Attendance must be marked from the college network' });
    }

    if (!faceEmbedding && faceImage) {
      faceEmbedding = await faceRecognition.extractEmbedding(faceImage);
    }

    if (!faceEmbedding || !Array.isArray(faceEmbedding)) {
      return res.status(400).json({ success: false, message: 'Face embedding or image is required' });
    }

    const user = req.user;
    if (!user || !user.faceEmbeddings || user.faceEmbeddings.length === 0) {
      return res.status(400).json({ success: false, message: 'Face registration is required before attendance' });
    }

    const verification = await faceRecognition.verifyFace(faceEmbedding, user.faceEmbeddings);
    if (!verification.verified) {
      return res.status(401).json({ success: false, message: 'Face match failed' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      student: user._id,
      subject,
      timestamp: { $gte: today },
    });

    if (alreadyMarked) {
      return res.status(409).json({ success: false, message: 'Attendance already marked today' });
    }

    const attendance = await Attendance.create({
      student: user._id,
      subject,
      status: 'present',
      attendanceMethod,
      wifiName: wifiName || process.env.COLLEGE_WIFI_NAME || 'RMK-CAMPUS',
      device: device || (req.headers['user-agent'] ?? 'browser'),
      browser: browser || (req.headers['user-agent'] ?? 'browser'),
      ip,
      faceVerified: verification.verified,
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

exports.logAttendanceBulk = async (req, res, next) => {
  try {
    const { subject, students, status = 'present' } = req.body;
    if (!subject || !students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: 'subject and students[] required' });
    }

    const docs = students.map((studentId) => ({ student: studentId, subject, status }));
    const inserted = await Attendance.insertMany(docs);
    res.status(201).json({ success: true, data: inserted });
  } catch (error) {
    next(error);
  }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find();
    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};
