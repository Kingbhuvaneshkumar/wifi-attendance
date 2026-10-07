import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceScanner = ({ onComplete, loading }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('Loading face models...');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const streamRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = import.meta.env.VITE_FACE_MODEL_URL || 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setModelLoaded(true);
        setStatus('Models loaded. Start camera and scan your face.');
      } catch (error) {
        console.error('Face model load error:', error);
        setStatus('Unable to load face models. Check your network or model path.');
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!modelLoaded) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraReady(true);
        setStatus('Camera ready. Position your face and scan.');
      } catch (error) {
        setStatus('Unable to access camera. Please allow webcam access.');
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [modelLoaded]);

  const handleScan = async () => {
    if (!videoRef.current || !modelLoaded) {
      setStatus('Camera or models are not ready yet.');
      return;
    }

    setStatus('Detecting face...');
    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setStatus('No face detected. Please move closer and try again.');
        return;
      }

      const descriptor = Array.from(detections.descriptor);
      setStatus('Face detected! Completing attendance...');
      onComplete({ faceEmbedding: descriptor, faceImage: captureImage() });
    } catch (error) {
      setStatus('Face scan failed. Try again.');
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 400, 300);
    return canvas.toDataURL('image/jpeg', 0.7);
  };

  return (
    <div className="face-scanner-card">
      <div className="scanner-header">
        <div>
          <h3>Face Scanner</h3>
          <p className="scanner-copy">Open your camera, center your face, and then tap scan.</p>
        </div>
        <div className="status-pill">{status}</div>
      </div>

      <video ref={videoRef} className="scanner-video" muted playsInline autoPlay />

      <div className="scanner-controls">
        <button type="button" onClick={handleScan} disabled={loading || !cameraReady}>
          {loading ? 'Processing...' : 'Scan Face'}
        </button>
      </div>
    </div>
  );
};

export default FaceScanner;
