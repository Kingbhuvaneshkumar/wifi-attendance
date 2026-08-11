const User = require('../models/User');
const faceRecognition = require('../services/faceRecognition');

exports.registerFace = async (req, res, next) => {
  try {
    const { faceImage, studentId } = req.body;

    if (!faceImage) {
      return res.status(400).json({ success: false, message: 'Face image is required' });
    }

    let user = req.user;
    if (!user) {
      if (!studentId) {
        return res.status(400).json({ success: false, message: 'Student ID is required when not authenticated' });
      }
      user = await User.findOne({ studentId });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const embedding = await faceRecognition.extractEmbedding(faceImage);
    user.studentId = studentId || user.studentId;
    user.faceEmbeddings = [...(user.faceEmbeddings || []), embedding];
    user.faceImages = [...(user.faceImages || []), faceImage];

    await user.save();

    res.json({
      success: true,
      data: {
        id: user._id,
        studentId: user.studentId,
        faceEmbeddings: user.faceEmbeddings.length,
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
