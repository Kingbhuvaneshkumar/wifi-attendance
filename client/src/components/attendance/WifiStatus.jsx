const WifiStatus = ({ ssid }) => {
  const isCollege = ssid ? ssid.toLowerCase().includes('rmk') : false;
  return (
    <div className="wifi-status-card">
      <div>
        <p className="wifi-label">Network status</p>
        <h4>{ssid || 'Unknown network'}</h4>
      </div>
      <span className={`wifi-pill ${isCollege ? 'wifi-safe' : 'wifi-fail'}`}>
        {isCollege ? 'College Network' : 'Unknown Network'}
      </span>
    </div>
  );
};

export default WifiStatus;
