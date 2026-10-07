const express = require('express');
const { getUsers, getUser, registerFace } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUser);
router.post('/face-register', protect, registerFace);

module.exports = router;

