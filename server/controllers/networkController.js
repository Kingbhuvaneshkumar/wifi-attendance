const wifiService = require('../services/wifiService');

exports.checkNetwork = (req, res, next) => {
  try {
    const ip = wifiService.getClientIp(req);
    const connected = wifiService.isCollegeNetwork(ip);

    return res.json({
      connected,
      network: connected ? 'College Network' : null,
    });
  } catch (error) {
    next(error);
  }
};
