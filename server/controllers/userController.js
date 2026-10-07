const User = require('../models/User');
const faceRecognition = require('../services/faceRecognition');

exports.registerFace = async (req, res, next) => {
  try {
    const { faceImage, studentId } = req.body;

    // Restrict to Admin only
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Face registration can only be performed by an Admin.' });
    }

    if (!faceImage) {
      return res.status(400).json({ success: false, message: 'Face image is required' });
    }

    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID or Email is required' });
    }

    const user = await User.findOne({
      $or: [{ studentId }, { email: studentId }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: `Student with ID/Email "${studentId}" not found.` });
    }

    const embedding = await faceRecognition.extractEmbedding(faceImage);
    user.faceEmbeddings = [...(user.faceEmbeddings || []), embedding];
    user.faceImages = [...(user.faceImages || []), faceImage];

    await user.save();

    res.json({
      success: true,
      message: `Face registered successfully for student ${user.name} (${user.studentId || user.email}).`,
      data: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        totalEmbeddings: user.faceEmbeddings.length,
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
