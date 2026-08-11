const connectDB = require('./config/db');
const Subject = require('./models/Subject');

const subjects = [
  { name: 'Database Management Systems', code: 'DBMS101', department: 'Computer Science', teacherName: 'Prof. Ramesh Gupta' },
  { name: 'React', code: 'REACT201', department: 'Computer Science', teacherName: 'Dr. Priya Sharma' },
  { name: 'Data Communication and Computer Networks', code: 'DCCN102', department: 'Computer Science', teacherName: 'Prof. Neha Joshi' },
  { name: 'Design and Analysis (DA)', code: 'DA103', department: 'Computer Science', teacherName: 'Dr. Anand Kumar' },
  { name: 'Machine Learning', code: 'ML104', department: 'Computer Science', teacherName: 'Prof. Aarti Patel' },
  { name: 'C++', code: 'CPP105', department: 'Computer Science', teacherName: 'Prof. Vikram Singh' },
];

const seed = async () => {
  await connectDB();
  try {
    // avoid duplicating subjects: upsert by code
    for (const s of subjects) {
      await Subject.updateOne({ code: s.code }, { $set: s }, { upsert: true });
    }
    console.log('Subjects seeded');
  } catch (e) {
    console.error('Seeding error:', e.message);
  } finally {
    process.exit();
  }
};

seed();
