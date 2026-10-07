import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const target = import.meta.env.VITE_API_TARGET || 'http://localhost:5000';
    socket = io(target, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });
  }
  return socket;
};

export const joinRoom = (roomName) => {
  const s = getSocket();
  if (s && roomName) {
    s.emit('join-room', roomName);
  }
};

export const leaveRoom = (roomName) => {
  const s = getSocket();
  if (s && roomName) {
    s.emit('leave-room', roomName);
  }
};
