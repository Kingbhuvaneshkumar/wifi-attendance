import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FacultyLayout from '../../layouts/FacultyLayout';
import { getSocket, joinRoom, leaveRoom } from '../../services/socket';
import api from '../../services/api';

const Dashboard = () => {
  const [liveEvents, setLiveEvents] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = async () => {
    try {
      const res = await api.get('/attendance');
      setRecentAttendance(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();

    joinRoom('faculty-room');
    const socket = getSocket();

    const handleAttendanceUpdate = (data) => {
      setLiveEvents((prev) => [data, ...prev.slice(0, 19)]);
      fetchRecent();
    };

    socket.on('attendance:updated', handleAttendanceUpdate);

    return () => {
      socket.off('attendance:updated', handleAttendanceUpdate);
      leaveRoom('faculty-room');
    };
  }, []);

  return (
    <FacultyLayout>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1>Faculty Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Real-time Wi-Fi & Face Attendance Control Center.</p>
          </div>
          <span style={{ fontSize: 13, backgroundColor: '#10b981', color: '#fff', padding: '6px 14px', borderRadius: 20, fontWeight: 600 }}>
            ⚡ Live Socket.io Feed Active
          </span>
        </div>

        {/* Quick Navigation Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          <Link to="/faculty/manage-attendance" className="quick-card quick-card-primary" style={{ textDecoration: 'none' }}>
            <div>
              <h3>Manage Attendance</h3>
              <p>Mark or update student attendance manually in real-time.</p>
            </div>
            <span>Open</span>
          </Link>

          <Link to="/faculty/students" className="quick-card quick-card-secondary" style={{ textDecoration: 'none' }}>
            <div>
              <h3>Student List</h3>
              <p>View all enrolled students and face registration status.</p>
            </div>
            <span>View</span>
          </Link>

          <Link to="/faculty/reports" className="quick-card quick-card-tertiary" style={{ textDecoration: 'none' }}>
            <div>
              <h3>Reports</h3>
              <p>Generate & export attendance reports for your classes.</p>
            </div>
            <span>Export</span>
          </Link>
        </div>

        {/* Real-time Live Check-ins Feed */}
        {liveEvents.length > 0 && (
          <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid #10b981' }}>
            <h3 style={{ marginTop: 0, color: '#10b981' }}>🔔 Live Real-Time Student Check-Ins</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {liveEvents.map((evt, idx) => (
                <div key={idx} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-muted, #f3f4f6)', borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    <strong>{evt.studentName || 'Student'}</strong> marked attendance for <strong>{evt.subject}</strong>
                  </span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{evt.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Attendance Records */}
        <div className="card">
          <h3>Recent Attendance Logs</h3>
          {loading ? (
            <p>Loading attendance logs...</p>
          ) : recentAttendance.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No attendance records found yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: 12 }}>Student Name</th>
                    <th style={{ padding: 12 }}>Subject</th>
                    <th style={{ padding: 12 }}>Status</th>
                    <th style={{ padding: 12 }}>Method</th>
                    <th style={{ padding: 12 }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance.slice(0, 10).map((r) => (
                    <tr key={r._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 12, fontWeight: 600 }}>
                        {r.student?.name || 'Student'} ({r.student?.studentId || r.student?.email || 'N/A'})
                      </td>
                      <td style={{ padding: 12 }}>{r.subject}</td>
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
                      <td style={{ padding: 12 }}>{new Date(r.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </FacultyLayout>
  );
};

export default Dashboard;
