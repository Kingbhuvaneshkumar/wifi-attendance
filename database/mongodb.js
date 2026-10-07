const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb+srv://abineshas788207_db_user:CykCx1WM8kIfMIxU@cluster0.fa0ilco.mongodb.net/wifi-attendance?retryWrites=true&w=majority';

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully to Atlas cluster');
  } catch (error) {
    console.warn('MongoDB Atlas connection failed:', error.message);
    console.warn('Falling back to in-memory MongoDB for development.');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('Connected to in-memory MongoDB');
    } catch (memErr) {
      console.error('Failed to start in-memory MongoDB:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;



