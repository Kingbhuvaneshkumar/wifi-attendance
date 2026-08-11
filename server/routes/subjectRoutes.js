const express = require('express');
const { getSubjects, createSubject } = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', protect, getSubjects);
router.post('/', protect, authorize('admin', 'faculty'), createSubject);

module.exports = router;
