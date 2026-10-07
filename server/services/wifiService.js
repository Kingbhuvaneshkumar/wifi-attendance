const COLLEGE_WIFI_NAME = process.env.COLLEGE_WIFI_NAME || 'RMK-CAMPUS';

const getAllowedNetworks = () => {
  const allowed = process.env.COLLEGE_NETWORK_ALLOWED || process.env.COLLEGE_PUBLIC_IP || '';
  return allowed
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
};

exports.getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.connection.remoteAddress || req.socket.remoteAddress || '';
};

exports.isCollegeNetwork = (ip) => {
  if (!ip) return true;

  const normalized = ip.replace('::ffff:', '');

  // Always allow localhost / loopback IPs
  if (normalized === '127.0.0.1' || normalized === '::1' || normalized === 'localhost' || normalized === '') {
    return true;
  }

  // Allow standard local Wi-Fi networks
  if (
    normalized.startsWith('192.168.') ||
    normalized.startsWith('10.') ||
    normalized.startsWith('172.16.') ||
    normalized.startsWith('172.17.') ||
    normalized.startsWith('172.18.') ||
    normalized.startsWith('172.19.') ||
    normalized.startsWith('172.2') ||
    normalized.startsWith('172.30.') ||
    normalized.startsWith('172.31.')
  ) {
    return true;
  }

  const allowedNetworks = getAllowedNetworks();
  if (allowedNetworks.length === 0) return true;

  const matchesAllowedPattern = allowedNetworks.some((pattern) => {
    if (pattern.endsWith('.*')) {
      return normalized.startsWith(pattern.replace('*', ''));
    }
    if (pattern.includes('/')) {
      try {
        const [range, bits] = pattern.split('/');
        const mask = parseInt(bits, 10);
        if (Number.isNaN(mask)) return false;
        const ipToNumber = (address) => address.split('.').reduce((acc, octet) => (acc << 8) + Number(octet), 0);
        return (ipToNumber(normalized) & (~0 << (32 - mask))) === (ipToNumber(range) & (~0 << (32 - mask)));
      } catch {
        return false;
      }
    }
    return normalized === pattern;
  });

  return matchesAllowedPattern || normalized === COLLEGE_WIFI_NAME;
};


exports.COLLEGE_WIFI_NAME = COLLEGE_WIFI_NAME;
