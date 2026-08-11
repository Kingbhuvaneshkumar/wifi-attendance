import api from './api';

export const markAttendance = async (payload) => {
  const res = await api.post('/attendance', payload);
  return res.data;
};

export const fetchAttendance = async () => {
  const res = await api.get('/attendance');
  return res.data?.data || [];
};

export const markAttendanceBulk = async (payload) => {
  const res = await api.post('/attendance/bulk', payload);
  return res.data;
};
