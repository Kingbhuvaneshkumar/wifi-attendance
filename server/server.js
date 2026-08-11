const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const networkRoutes = require('./routes/networkRoutes');
const userRoutes = require('./routes/userRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/network', networkRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/subjects', subjectRoutes);
  app.use('/api/reports', reportRoutes);

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please stop the existing server or use a different port.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
};

startServer();
