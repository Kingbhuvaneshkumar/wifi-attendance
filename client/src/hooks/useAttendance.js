import { useState, useEffect } from 'react';
import { fetchAttendance } from '../services/attendance';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAttendance = async () => {
      setLoading(true);
      const data = await fetchAttendance();
      setAttendance(data || []);
      setLoading(false);
    };

    loadAttendance();
  }, []);

  return { attendance, loading };
};
