const QRScanner = ({ onScan }) => (
  <div className="qr-scanner">
    <p>Scan QR code to mark attendance.</p>
    <button onClick={() => onScan('QR-12345')}>Simulate Scan</button>
  </div>
);

export default QRScanner;
