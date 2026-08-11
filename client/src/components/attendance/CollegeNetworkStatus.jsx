import { useEffect, useState } from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';

const CollegeNetworkStatus = ({ onStatus }) => {
  const [status, setStatus] = useState({ connected: false, network: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStatus = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/network/check');
        setStatus({ connected: data.connected, network: data.network });
        if (onStatus) onStatus({ connected: data.connected, network: data.network });
      } catch (err) {
        setError('Unable to verify college network. Please try again.');
        setStatus({ connected: false, network: null });
        if (onStatus) onStatus({ connected: false, network: null });
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, []);

  return (
    <div className="network-status-card">
      <div className="network-status-header">
        <p className="eyebrow">Network verification</p>
        {loading ? (
          <span className="network-loading">Checking...</span>
        ) : status.connected ? (
          <span className="network-badge network-badge-success">Connected</span>
        ) : (
          <span className="network-badge network-badge-fail">Not connected</span>
        )}
      </div>

      <div className="network-status-body">
        {loading ? (
          <div className="network-spinner" />
        ) : status.connected ? (
          <div className="network-result network-result-success">
            <FiCheckCircle className="network-icon network-icon-success" />
            <div>
              <p>✅ Connected to College Network</p>
              <p className="network-subtext">{status.network}</p>
            </div>
          </div>
        ) : (
          <div className="network-result network-result-fail">
            <FiAlertCircle className="network-icon network-icon-fail" />
            <div>
              <p>❌ Not Connected to College Network</p>
              <p className="network-subtext">Please connect to the college WiFi/network to mark attendance.</p>
            </div>
          </div>
        )}
        {error && <p className="network-error">{error}</p>}
      </div>
    </div>
  );
};

export default CollegeNetworkStatus;
