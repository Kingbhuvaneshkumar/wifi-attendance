const mongoose = require('mongoose');
const User = require('../models/User');
const Subject = require('../models/Subject');
const WiFiConfig = require('../models/WiFiConfig');
const ClassSession = require('../models/ClassSession');
const AuditLog = require('../models/AuditLog');

const defaultUsers = [
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
  { name: 'Faculty User', email: 'faculty@example.com', password: 'faculty123', role: 'faculty' },
  { name: 'Student User', email: 'student@example.com', password: 'student123', role: 'student' },
];

const defaultSubjects = [
  { name: 'Database Management Systems', code: 'DBMS101', department: 'Computer Science', teacherName: 'Prof. Ramesh Gupta' },
  { name: 'React', code: 'REACT201', department: 'Computer Science', teacherName: 'Dr. Priya Sharma' },
  { name: 'Data Communication and Computer Networks', code: 'DCCN102', department: 'Computer Science', teacherName: 'Prof. Neha Joshi' },
  { name: 'Design and Analysis (DA)', code: 'DA103', department: 'Computer Science', teacherName: 'Dr. Anand Kumar' },
  { name: 'Machine Learning', code: 'ML104', department: 'Computer Science', teacherName: 'Prof. Aarti Patel' },
  { name: 'C++', code: 'CPP105', department: 'Computer Science', teacherName: 'Prof. Vikram Singh' },
];

const defaultWiFi = [
  { ssid: 'RMK-CAMPUS', allowedIpPrefix: '192.168.', department: 'Computer Science', isActive: true },
];

const seedDefaultData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await Promise.all(defaultUsers.map((user) => User.create(user)));
      console.log('Default users seeded in MongoDB Atlas.');
    }

    const subjectCount = await Subject.countDocuments();
    if (subjectCount === 0) {
      for (const s of defaultSubjects) {
        await Subject.updateOne({ code: s.code }, { $set: s }, { upsert: true });
      }
      console.log('Default subjects seeded in MongoDB Atlas.');
    }

    const wifiCount = await WiFiConfig.countDocuments();
    if (wifiCount === 0) {
      for (const w of defaultWiFi) {
        await WiFiConfig.updateOne({ ssid: w.ssid }, { $set: w }, { upsert: true });
      }
      console.log('Default WiFi configurations seeded in MongoDB Atlas.');
    }
  } catch (err) {
    console.error('Error seeding default data:', err.message);
  }
};


const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb+srv://abineshas788207_db_user:CykCx1WM8kIfMIxU@cluster0.fa0ilco.mongodb.net/wifi-attendance?retryWrites=true&w=majority';

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected to Atlas cluster`);
    
    // Seed default data
    const userCount = await User.countDocuments().catch(() => null);
    if (userCount === null) {
      throw new Error('Database query failed due to Atlas SSL/Network restrictions');
    }
    
    await seedDefaultData();
    return;
  } catch (error) {
    console.warn('MongoDB Atlas connection/query failed:', error.message);
    console.warn('Falling back to in-memory MongoDB for development.');

    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('Connected to in-memory MongoDB');
      await seedDefaultData();

      const shutdown = async () => {
        try {
          await mongoose.disconnect();
          await mongod.stop();
        } catch (_) {}
        process.exit(0);
      };
      process.once('SIGINT', shutdown);
      process.once('SIGTERM', shutdown);
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};


module.exports = connectDB;

