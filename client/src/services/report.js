import api from './api';

export const fetchReports = async () => {
  const res = await api.get('/reports');
  return res.data?.data || [];
};
