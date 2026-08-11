import { useEffect, useRef, useState } from 'react';
import { registerFace } from '../services/user';

const RegisterFace = ({ onSuccess }) => {
  const [faceImage, setFaceImage] = useState('');
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const openCamera = async () => {
    setCameraError('');
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

        await new Promise((resolve, reject) => {
          const handleReady = () => {
            if (!videoRef.current) return;
            videoRef.current.removeEventListener('loadedmetadata', handleReady);
            videoRef.current.removeEventListener('canplay', handleReady);
            clearTimeout(timeoutId);
            resolve();
          };

          videoRef.current.addEventListener('loadedmetadata', handleReady);
          videoRef.current.addEventListener('canplay', handleReady);

          if (videoRef.current.readyState >= 3) {
            videoRef.current.removeEventListener('loadedmetadata', handleReady);
            videoRef.current.removeEventListener('canplay', handleReady);
            resolve();
            return;
          }

          const timeoutId = setTimeout(() => {
            if (!videoRef.current || videoRef.current.readyState < 3) {
              videoRef.current?.removeEventListener('loadedmetadata', handleReady);
              videoRef.current?.removeEventListener('canplay', handleReady);
              reject(new Error('Camera load timeout'));
            }
          }, 3000);
        });

        await videoRef.current.play();
      } else {
        setCameraOpen(true);
      }

      setCameraReady(true);
      setCameraError('');
      setMessageType('success');
      setMessage('Camera open. Position your face and click Capture.');
    } catch (error) {
      setCameraOpen(false);
      setCameraReady(false);
      setCameraError('Unable to access camera. Please allow webcam access.');
      setMessageType('error');
      setMessage('Unable to open camera. Please allow webcam access.');
    } finally {
      setCameraLoading(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
    setCameraReady(false);
  };

  const handleCapture = () => {
    if (!videoRef.current || !cameraReady) {
      setMessageType('error');
      setMessage('Camera is not ready yet. Open the camera and wait for it to initialize.');
      return;
    }

    const canvas = document.createElement('canvas');
    const width = videoRef.current.videoWidth || 640;
    const height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setMessageType('error');
      setMessage('Unable to capture the image. Please try again.');
      return;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(videoRef.current, 0, 0, width, height);

    const base64 = canvas.toDataURL('image/jpeg');
    setFaceImage(base64);
    setMessageType('success');
    setMessage('Face captured successfully. Submit to register or retake the photo.');
    closeCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!faceImage) {
      setMessageType('error');
      setMessage('Capture your face first.');
      return;
    }
    if (!studentId) {
      setMessageType('error');
      setMessage('Please enter your student ID.');
      return;
    }
    try {
      setLoading(true);
      await registerFace({ faceImage, studentId });
      setMessageType('success');
      setMessage('Face registration successful.');
      setFaceImage('');
      onSuccess();
    } catch (error) {
      setMessageType('error');
      setMessage(
        error?.response?.data?.message ||
        error?.message ||
        'Failed to register face.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="face-register-card">
      <h3>Register Face</h3>
      <label>
        Student ID
        <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Enter your student ID" />
      </label>

      <div className="camera-preview">
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          muted
          playsInline
          style={{ display: cameraOpen ? 'block' : 'none' }}
        />

        {!cameraOpen && (
          <div className="camera-placeholder">
            <p>Camera is closed. Click Open Camera to start.</p>
            {cameraError && <p className="camera-error">{cameraError}</p>}
          </div>
        )}

        {cameraOpen && !cameraReady && (
          <div className="camera-placeholder">
            <p>{cameraLoading ? 'Opening camera...' : 'Initializing camera...'}</p>
          </div>
        )}
      </div>

      <div className="button-row">
        <button type="button" onClick={openCamera} disabled={cameraOpen || loading || cameraLoading}>
          {cameraLoading ? 'Opening Camera...' : 'Open Camera'}
        </button>
        <button type="button" onClick={handleCapture} disabled={!cameraOpen || !cameraReady || loading}>
          {loading ? 'Capturing...' : 'Capture Face'}
        </button>
        <button type="button" onClick={closeCamera} disabled={!cameraOpen}>
          Close Camera
        </button>
      </div>

      {faceImage && (
        <div className="captured-preview">
          <p>Captured image:</p>
          <img src={faceImage} alt="Captured face" />
        </div>
      )}

      <button type="button" onClick={handleSubmit} disabled={loading || !faceImage}>
        {loading ? 'Registering...' : 'Submit Face Registration'}
      </button>

      {message && <div className={`notification notification-${messageType}`}>{message}</div>}
    </div>
  );
};

export default RegisterFace;
