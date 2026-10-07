import { useState, useEffect } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import FaceScanner from '../FaceScanner';
import CollegeNetworkStatus from '../../components/attendance/CollegeNetworkStatus';
import { markAttendance } from '../../services/attendance';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Attendance = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [networkConnected, setNetworkConnected] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/subjects');
        const list = res.data?.data || [];
        setSubjects(list);
        if (list.length > 0) setSelectedSubject(list[0].name);
        else setSelectedSubject('Computer Networks');
      } catch (e) {
        setSelectedSubject('Computer Networks');
      }
    };
    fetchSubjects();
  }, []);

  const handleAttendance = async ({ faceImage, faceEmbedding }) => {
    try {
      setLoading(true);
      setMessageType('success');
      setMessage('Verifying face and checking network...');

      const targetSubject = selectedSubject || 'Computer Networks';

      const payload = {
        subject: targetSubject,
        faceImage,
        faceEmbedding,
        attendanceMethod: 'face',
        wifiName: 'RMK-CAMPUS',
        device: navigator.platform || 'browser',
        browser: navigator.userAgent,
      };

      await markAttendance(payload);
      setMessageType('success');
      setMessage(`🎉 Success! Attendance marked for ${targetSubject}.`);
    } catch (err) {
      setMessageType('error');
      const apiErrMsg = err?.response?.data?.message;
      if (apiErrMsg && apiErrMsg.includes('Face registration is required')) {
        setMessage('⚠️ Your face is not registered yet. Please contact the Administrator to enroll your face.');
      } else {
        setMessage(apiErrMsg || 'Unable to mark attendance. Please scan face again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="container">
        <section className="attendance-hero">
          <div>
            <p className="eyebrow">Student Attendance</p>
            <h1>Smart face and WiFi attendance</h1>
            <p className="hero-copy">Securely mark your attendance using college network verification and face scanning.</p>
          </div>
          <div className="hero-stat-card">
            <p>Quick Steps</p>
            <ol>
              <li>Verify network</li>
              <li>Select subject</li>
              <li>Scan face</li>
              <li>Complete attendance</li>
            </ol>
          </div>
        </section>

        <div className="card attendance-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ margin: 0 }}>Mark Attendance</h2>
            <span style={{ fontSize: 13, backgroundColor: '#3b82f6', color: '#fff', padding: '6px 12px', borderRadius: 20 }}>
              🛡️ Admin Enrolled Face Matching
            </span>
          </div>

          <CollegeNetworkStatus onStatus={(status) => setNetworkConnected(status.connected)} />

          {message && (
            <div
              className={`notification notification-${messageType}`}
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                marginTop: 16,
                marginBottom: 16,
                backgroundColor: messageType === 'success' ? '#10b981' : '#ef4444',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              {message}
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 16, padding: 16, backgroundColor: 'var(--bg-muted, #f8fafc)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: 8, fontSize: 15 }}>
                Select Subject for Today's Attendance:
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', fontSize: 15 }}
              >
                {subjects.length > 0 ? (
                  subjects.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name} ({s.code})
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Database Management Systems">Database Management Systems (DBMS101)</option>
                    <option value="React">React (REACT201)</option>
                    <option value="Data Communication and Computer Networks">Data Communication and Computer Networks (DCCN102)</option>
                    <option value="Design and Analysis (DA)">Design and Analysis (DA103)</option>
                    <option value="Machine Learning">Machine Learning (ML104)</option>
                    <option value="C++">C++ (CPP105)</option>
                  </>
                )}
              </select>
            </div>

            <FaceScanner onComplete={handleAttendance} loading={loading} />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Attendance;
