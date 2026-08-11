const mongoose = require('mongoose');
const connectDB = require('./mongodb');
const User = require('../server/models/User');
const Subject = require('../server/models/Subject');

const seed = async () => {
  await connectDB();
  await User.deleteMany();
  await Subject.deleteMany();

  await User.create([
    { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { name: 'Faculty User', email: 'faculty@example.com', password: 'faculty123', role: 'faculty' },
    { name: 'Student User', email: 'student@example.com', password: 'student123', role: 'student' },
  ]);

  await Subject.create([
    { name: 'Computer Networks', code: 'CN101', department: 'Computer Science' },
    { name: 'Database Systems', code: 'DB102', department: 'Computer Science' },
  ]);

  console.log('Seed complete');
  process.exit();
};

seed();
