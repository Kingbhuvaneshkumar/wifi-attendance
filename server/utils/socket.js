let ioInstance = null;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-room', (room) => {
      if (room) {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
      }
    });

    socket.on('leave-room', (room) => {
      if (room) {
        socket.leave(room);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

const getIO = () => {
  return ioInstance;
};

const emitAttendanceUpdate = (data) => {
  if (ioInstance) {
    // Broadcast to faculty room
    ioInstance.to('faculty-room').emit('attendance:updated', data);

    // Broadcast to specific student room
    const sId = data.studentId || (data.student && data.student._id) || data.student;
    if (sId) {
      ioInstance.to(`student:${sId}`).emit('attendance:updated', data);
    }

    // General broadcast to all connected clients
    ioInstance.emit('attendance:live', data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitAttendanceUpdate,
};
