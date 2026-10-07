const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, studentId } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const createData = { name, email: normalizedEmail, password, role };
    if (role === 'student' && studentId) {
      createData.studentId = studentId;
    }

    const user = await User.create(createData);
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      data: userObj,
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || error.keyValue || {})[0];
      const message = field === 'email'
        ? 'Email already exists.'
        : field === 'studentId'
        ? 'Student ID already exists.'
        : 'Duplicate field value detected.';
      return res.status(400).json({ success: false, message });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email/Student ID and password are required' });
    }

    const rawInput = email.trim();
    const user = await User.findOne({
      $or: [
        { email: rawInput.toLowerCase() },
        { email: new RegExp(`^${rawInput}$`, 'i') },
        { studentId: rawInput },
      ],
    }).select('+password');

    if (!user || !(await user.matchPassword(password.trim()))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email/student ID and password.' });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      data: userObj,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

