const express = require('express');
const { logAttendance, logAttendanceBulk, markManualAttendance, getAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, logAttendance);
router.post('/manual', protect, markManualAttendance);
router.post('/bulk', protect, logAttendanceBulk);
router.get('/', protect, getAttendance);

module.exports = router;

