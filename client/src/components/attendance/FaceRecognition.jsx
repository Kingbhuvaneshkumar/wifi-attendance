const FaceRecognition = ({ onVerify }) => (
  <div className="face-recognition">
    <p>Face recognition verification</p>
    <button onClick={() => onVerify(true)}>Verify Face</button>
  </div>
);

export default FaceRecognition;
