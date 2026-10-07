import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import CollegeNetworkStatus from '../../components/attendance/CollegeNetworkStatus';
import { useAuth } from '../../context/AuthContext';
import { getSocket, joinRoom, leaveRoom } from '../../services/socket';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveMessage, setLiveMessage] = useState('');

  const fetchRecords = async () => {
    try {
      if (!user?._id) return;
      const res = await api.get(`/attendance?student=${user._id}`);
      setRecords(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load attendance history', err);
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
      const handleLiveUpdate = (data) => {
        if (data.studentId === user._id || (data.student && data.student._id === user._id)) {
          setLiveMessage(`Live Alert: Attendance for ${data.subject} was marked as ${data.status.toUpperCase()}!`);
          fetchRecords();
          setTimeout(() => setLiveMessage(''), 8000);
        }
      };

      socket.on('attendance:updated', handleLiveUpdate);

      return () => {
        socket.off('attendance:updated', handleLiveUpdate);
        leaveRoom(room);
      };
    }
  }, [user]);

  const todayStr = new Date().toDateString();
  const todayRecords = records.filter(
    (r) => new Date(r.timestamp).toDateString() === todayStr
  );
  const presentToday = todayRecords.some((r) => r.status === 'present');

  const totalClasses = records.length;
  const totalPresent = records.filter((r) => r.status === 'present').length;
  const percentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 100;

  return (
    <StudentLayout>
      <div className="container">
        <CollegeNetworkStatus />

        {liveMessage && (
          <div className="notification" style={{ backgroundColor: '#10b981', color: '#fff', fontWeight: 600, padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
            🔔 {liveMessage}
          </div>
        )}

        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">Welcome back, {user?.name || 'Student'}</p>
            <h1>Student Dashboard</h1>
            <p className="hero-copy">Real-time attendance tracking via Wi-Fi network & Face Verification.</p>
          </div>
          <div className="hero-stat-card dashboard-hero-card">
            <p>Today’s Attendance</p>
            <h2 style={{ color: presentToday ? '#10b981' : '#f59e0b' }}>
              {presentToday ? 'Marked Present' : 'Not marked yet'}
            </h2>
            <p>
              {presentToday
                ? 'Your attendance has been verified for today.'
                : 'Connect to RMK Wi-Fi and verify your face to mark attendance.'}
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 30 }}>
          <div className="card" style={{ textAlign: 'center', padding: 20 }}>
            <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Overall Attendance</h4>
            <h1 style={{ margin: '8px 0', fontSize: 36, color: percentage >= 75 ? '#10b981' : '#ef4444' }}>{percentage}%</h1>
            <small>{totalPresent} of {totalClasses} classes attended</small>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 20 }}>
            <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Today's Sessions</h4>
            <h1 style={{ margin: '8px 0', fontSize: 36, color: '#3b82f6' }}>{todayRecords.length}</h1>
            <small>Sessions recorded today</small>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 20 }}>
            <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Student ID</h4>
            <h2 style={{ margin: '12px 0' }}>{user?.studentId || user?.email || 'N/A'}</h2>
            <small>Registered Student</small>
          </div>
        </div>

        {/* Navigation Grid */}
        <section className="dashboard-grid" style={{ marginBottom: 30 }}>
          <Link to="/student/attendance" className="quick-card quick-card-primary">
            <div>
              <h3>Mark Attendance</h3>
              <p>Open face scanner + Wi-Fi check to mark today's attendance.</p>
            </div>
            <span>Scan Face</span>
          </Link>

          <Link to="/student/history" className="quick-card quick-card-secondary">
            <div>
              <h3>Attendance History</h3>
              <p>View complete attendance records & faculty updates.</p>
            </div>
            <span>View Logs</span>
          </Link>
        </section>

        {/* Live Attendance History Table */}
        <div className="card" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Recent Real-Time Attendance History</h3>
            <span style={{ fontSize: 12, backgroundColor: '#3b82f6', color: '#fff', padding: '4px 10px', borderRadius: 20 }}>⚡ Real-Time Connected</span>
          </div>

          {loading ? (
            <p>Loading attendance history...</p>
          ) : records.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No attendance records found yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: 12 }}>Date & Time</th>
                    <th style={{ padding: 12 }}>Subject</th>
                    <th style={{ padding: 12 }}>Status</th>
                    <th style={{ padding: 12 }}>Method</th>
                    <th style={{ padding: 12 }}>Wi-Fi Network</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 10).map((r) => (
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

export default Dashboard;
