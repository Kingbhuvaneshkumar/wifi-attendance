const mongoose = require('mongoose');
const User = require('../models/User');

const defaultUsers = [
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { name: 'Faculty User', email: 'faculty@example.com', password: 'faculty123', role: 'faculty' },
  { name: 'Student User', email: 'student@example.com', password: 'student123', role: 'student' },
];

const seedDefaultUsers = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await Promise.all(defaultUsers.map((user) => User.create(user)));
    console.log('Default users seeded. Use student@example.com / student123 to log in.');
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wifi-attendance';

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected to ${uri}`);
    await seedDefaultUsers();
    return;
  } catch (error) {
    console.warn('MongoDB connection failed:', error.message);
    console.warn('Falling back to in-memory MongoDB for development.');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to in-memory MongoDB');
      await seedDefaultUsers();

      const shutdown = async () => {
        await mongoose.disconnect();
        await mongod.stop();
        process.exit(0);
      };
      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
      process.on('exit', shutdown);
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
