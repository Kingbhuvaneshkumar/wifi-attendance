import api from './api';

export const fetchUsers = async () => {
  const res = await api.get('/users');
  return res.data?.data || [];
};

export const registerFace = async (payload) => {
  const res = await api.post('/users/face-register', payload);
  return res.data;
};
