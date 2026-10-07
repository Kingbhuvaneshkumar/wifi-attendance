const Attendance = require('../models/Attendance');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const wifiService = require('../services/wifiService');
const faceRecognition = require('../services/faceRecognition');
const { emitAttendanceUpdate } = require('../utils/socket');

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

    const populated = await Attendance.findById(attendance._id).populate('student', 'name email studentId role');

    // Audit log
    await AuditLog.create({
      action: 'ATTENDANCE_MARKED_SELF',
      performedBy: user._id,
      targetStudent: user._id,
      details: { subject, wifiName, method: attendanceMethod },
    });

    // Real-time Socket.io broadcast to Faculty & Student dashboards
    emitAttendanceUpdate({
      type: 'ATTENDANCE_SUBMITTED',
      attendance: populated,
      studentId: user._id.toString(),
      studentName: user.name,
      subject,
      status: 'present',
      timestamp: attendance.timestamp,
    });

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.markManualAttendance = async (req, res, next) => {
  try {
    const { student, subject, status = 'present' } = req.body;
    if (!student || !subject) {
      return res.status(400).json({ success: false, message: 'Student ID and subject are required' });
    }

    const attendance = await Attendance.create({
      student,
      subject,
      status,
      attendanceMethod: 'manual',
      wifiName: 'FACULTY_OVERRIDE',
      faceVerified: true,
    });

    const populated = await Attendance.findById(attendance._id).populate('student', 'name email studentId role');

    // Notification
    await Notification.create({
      title: 'Attendance Updated',
      message: `Your attendance for ${subject} was marked as ${status.toUpperCase()} by faculty.`,
    });

    // Audit log
    await AuditLog.create({
      action: 'FACULTY_ATTENDANCE_MARK',
      performedBy: req.user ? req.user._id : null,
      targetStudent: student,
      details: { subject, status },
    });

    // Real-time Socket.io broadcast
    emitAttendanceUpdate({
      type: 'FACULTY_MARKED_ATTENDANCE',
      attendance: populated,
      studentId: student.toString(),
      studentName: populated.student ? populated.student.name : 'Student',
      subject,
      status,
      timestamp: attendance.timestamp,
    });

    res.status(201).json({ success: true, data: populated });
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

    const docs = students.map((studentId) => ({
      student: studentId,
      subject,
      status,
      attendanceMethod: 'manual',
      wifiName: 'FACULTY_BULK_OVERRIDE',
    }));
    const inserted = await Attendance.insertMany(docs);

    // Real-time Socket.io broadcasts for each student
    for (const item of inserted) {
      const populated = await Attendance.findById(item._id).populate('student', 'name email studentId role');
      emitAttendanceUpdate({
        type: 'FACULTY_MARKED_ATTENDANCE',
        attendance: populated,
        studentId: item.student.toString(),
        studentName: populated.student ? populated.student.name : 'Student',
        subject,
        status,
        timestamp: item.timestamp,
      });
    }

    res.status(201).json({ success: true, data: inserted });
  } catch (error) {
    next(error);
  }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.subject) filter.subject = req.query.subject;

    const attendance = await Attendance.find(filter)
      .populate('student', 'name email studentId role')
      .sort({ timestamp: -1 });

    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

