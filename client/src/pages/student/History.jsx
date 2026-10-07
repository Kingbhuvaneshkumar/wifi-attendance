import React, { useEffect, useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import { getSocket, joinRoom, leaveRoom } from '../../services/socket';
import api from '../../services/api';

const History = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('');

  const fetchRecords = async () => {
    try {
      if (!user?._id) return;
      const res = await api.get(`/attendance?student=${user._id}`);
      setRecords(res.data?.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();

    if (user?._id) {
      const room = `student:${user._id}`;
      joinRoom(room);
      const socket = getSocket();

      const handleUpdate = () => {
        fetchRecords();
      };

      socket.on('attendance:updated', handleUpdate);
      return () => {
        socket.off('attendance:updated', handleUpdate);
        leaveRoom(room);
      };
    }
  }, [user]);

  const filtered = filterSubject
    ? records.filter((r) => r.subject.toLowerCase().includes(filterSubject.toLowerCase()))
    : records;

  return (
    <StudentLayout>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1>Attendance History</h1>
            <p style={{ color: 'var(--text-muted)' }}>Complete audit log of your verified attendance sessions.</p>
          </div>
          <span style={{ fontSize: 13, backgroundColor: '#10b981', color: '#fff', padding: '6px 14px', borderRadius: 20, fontWeight: 600 }}>
            ⚡ Socket.io Real-Time Active
          </span>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <input
            placeholder="Filter by subject name..."
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)' }}
          />
        </div>

        <div className="card">
          {loading ? (
            <p>Loading attendance history...</p>
          ) : filtered.length === 0 ? (
            <p>No records found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: 12 }}>Date & Time</th>
                    <th style={{ padding: 12 }}>Subject</th>
                    <th style={{ padding: 12 }}>Status</th>
                    <th style={{ padding: 12 }}>Method</th>
                    <th style={{ padding: 12 }}>Network / Wi-Fi</th>
                    <th style={{ padding: 12 }}>Face Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12 }}>{new Date(r.timestamp).toLocaleString()}</td>
                      <td style={{ padding: 12, fontWeight: 600 }}>{r.subject}</td>
                      <td style={{ padding: 12 }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor: r.status === 'present' ? '#d1fae5' : '#fee2e2',
                          color: r.status === 'present' ? '#065f46' : '#991b1b',
                        }}>
                          {r.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: 12 }}>{r.attendanceMethod ? r.attendanceMethod.toUpperCase() : 'FACE'}</td>
                      <td style={{ padding: 12 }}>{r.wifiName || 'RMK-CAMPUS'}</td>
                      <td style={{ padding: 12 }}>{r.faceVerified ? '✅ Verified' : '❌ Manual'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default History;
