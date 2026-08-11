const http = require('http');
const payload = JSON.stringify({name: 'Test User', email: 'test_user_12345@example.com', password: '123456', role: 'student'});
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    try {
      console.log('BODY', JSON.parse(body));
    } catch (e) {
      console.log('BODY_RAW', body);
    }
  });
});

req.on('error', (e) => {
  console.error('ERROR', e.message);
});

req.write(payload);
req.end();
