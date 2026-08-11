import { useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import RegisterFace from '../RegisterFace';
import FaceScanner from '../FaceScanner';
import CollegeNetworkStatus from '../../components/attendance/CollegeNetworkStatus';
import { markAttendance } from '../../services/attendance';
import { useAuth } from '../../hooks/useAuth';

const Attendance = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState('summary');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [networkConnected, setNetworkConnected] = useState(false);

  const handleAttendance = async ({ faceImage, faceEmbedding }) => {
    try {
      if (!networkConnected) {
        setMessageType('error');
        setMessage('Connect to the college network before marking attendance.');
        return;
      }

      setLoading(true);
      setMessageType('success');
      setMessage('Verifying attendance...');

      const payload = {
        subject: 'General Attendance',
        faceImage,
        faceEmbedding,
        attendanceMethod: 'face',
        wifiName: 'RMK-CAMPUS',
        device: navigator.platform || 'browser',
        browser: navigator.userAgent,
      };

      await markAttendance(payload);
      setMessageType('success');
      setMessage('Attendance marked successfully.');
      setMode('summary');
    } catch (err) {
      setMessageType('error');
      setMessage(err?.response?.data?.message || 'Unable to mark attendance.');
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
              <li>Open camera</li>
              <li>Scan face</li>
              <li>Complete attendance</li>
            </ol>
          </div>
        </section>

        <div className="card attendance-card">
          <div className="button-row">
            <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setMessage(''); }}>
              Register Face
            </button>
            <button
              className={mode === 'scan' ? 'active' : ''}
              onClick={() => { setMode('scan'); setMessage(''); }}
              disabled={!networkConnected}
              title={!networkConnected ? 'Connect to the college network to mark attendance' : 'Mark attendance'}
            >
              Mark Attendance
            </button>
          </div>

          <CollegeNetworkStatus onStatus={(status) => setNetworkConnected(status.connected)} />
          {message && <div className={`notification notification-${messageType}`}>{message}</div>}

          {mode === 'register' && (
            <RegisterFace
              onSuccess={() => {
                setMessageType('success');
                setMessage('Face registration completed. You can now mark attendance.');
                setMode('summary');
              }}
            />
          )}

          {mode === 'scan' && (
            <FaceScanner onComplete={handleAttendance} loading={loading} />
          )}

          {mode === 'summary' && (
            <div className="info-panel attendance-summary">
              <h2>Ready to mark attendance</h2>
              <p>Welcome back, {user?.name || 'student'}.</p>
              <p>Choose one of the actions above to start face registration or attendance scanning.</p>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default Attendance;

