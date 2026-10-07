import { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { fetchUsers, registerFace } from '../../services/user';

const RegisterFaceAdmin = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [faceImage, setFaceImage] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const users = await fetchUsers();
        const list = users.filter((u) => u.role === 'student');
        setStudents(list);
        if (list.length > 0) setSelectedStudentId(list[0].studentId || list[0].email);
      } catch (e) {
        console.error('Failed to load students', e);
      }
    };
    loadStudents();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const openCamera = async () => {
    setMessage('');
    setCameraLoading(true);
    setCameraReady(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        setCameraOpen(true);
        await videoRef.current.play();
      }
      setCameraReady(true);
      setMessageType('success');
      setMessage('Camera open. Position student face and click Capture.');
    } catch (err) {
      setCameraOpen(false);
      setMessageType('error');
      setMessage('Unable to open camera. Please check webcam permissions.');
    } finally {
      setCameraLoading(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
    setCameraReady(false);
  };

  const handleCapture = () => {
    if (!videoRef.current || !cameraReady) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg');
    setFaceImage(base64);
    setMessageType('success');
    setMessage('Face photo captured! Review and click Register.');
    closeCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!faceImage) {
      setMessageType('error');
      setMessage('Capture face photo first.');
      return;
    }
    if (!selectedStudentId) {
      setMessageType('error');
      setMessage('Please select a student.');
      return;
    }

    try {
      setLoading(true);
      await registerFace({ faceImage, studentId: selectedStudentId });
      setMessageType('success');
      setMessage(`🎉 Face registration completed for student (${selectedStudentId})!`);
      setFaceImage('');
    } catch (err) {
      setMessageType('error');
      setMessage(err?.response?.data?.message || 'Failed to register student face.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studentId && s.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h1>Admin Face Registration Portal</h1>
            <p style={{ color: 'var(--text-muted)' }}>Exclusively enroll and manage official student face biometric data.</p>
          </div>
          <span style={{ fontSize: 13, backgroundColor: '#2563eb', color: '#fff', padding: '6px 14px', borderRadius: 20, fontWeight: 600 }}>
            🛡️ Admin Authorization Required
          </span>
        </div>

        {message && (
          <div className="notification" style={{ backgroundColor: messageType === 'success' ? '#10b981' : '#ef4444', color: '#fff', padding: '12px 16px', borderRadius: 8, marginBottom: 20 }}>
            {message}
          </div>
        )}

        <div className="card" style={{ marginBottom: 20 }}>
          <h3>1. Select Student to Enroll</h3>
          <input
            placeholder="Search student by name, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', marginBottom: 12 }}
          />

          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid var(--border)', fontSize: 16 }}
          >
            {filteredStudents.map((s) => (
              <option key={s._id} value={s.studentId || s.email}>
                {s.name} — ({s.studentId || s.email}) {s.faceEmbeddings?.length ? '✅ Already Enrolled' : '⚠️ Not Enrolled'}
              </option>
            ))}
          </select>
        </div>

        <div className="card">
          <h3>2. Capture Student Face Biometric</h3>

          <div style={{ margin: '16px 0', minHeight: 280, backgroundColor: '#000', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', maxHeight: 400, display: cameraOpen ? 'block' : 'none' }} />
            {!cameraOpen && (
              <p style={{ color: '#94a3b8' }}>Camera is closed. Click "Open Camera" to start.</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <button className="btn" onClick={openCamera} disabled={cameraOpen || cameraLoading} style={{ backgroundColor: '#2563eb', color: '#fff' }}>
              {cameraLoading ? 'Opening...' : 'Open Camera'}
            </button>
            <button className="btn" onClick={handleCapture} disabled={!cameraOpen || !cameraReady} style={{ backgroundColor: '#10b981', color: '#fff' }}>
              Capture Face
            </button>
            <button className="btn" onClick={closeCamera} disabled={!cameraOpen} style={{ backgroundColor: '#64748b', color: '#fff' }}>
              Close Camera
            </button>
          </div>

          {faceImage && (
            <div style={{ marginTop: 16, marginBottom: 16, textAlign: 'center' }}>
              <p style={{ fontWeight: 600 }}>Captured Face Photo Preview:</p>
              <img src={faceImage} alt="Captured" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: '50%', border: '4px solid #10b981' }} />
            </div>
          )}

          <button
            className="btn"
            onClick={handleSubmit}
            disabled={loading || !faceImage}
            style={{ width: '100%', padding: '14px', fontSize: 16, backgroundColor: '#10b981', color: '#fff', fontWeight: 700, borderRadius: 8 }}
          >
            {loading ? 'Processing & Storing Embedding...' : 'Submit & Enroll Face Data'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RegisterFaceAdmin;
