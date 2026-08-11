const Notification = require('../models/Notification');

exports.sendNotification = async ({ title, message }) => {
  return Notification.create({ title, message });
};
