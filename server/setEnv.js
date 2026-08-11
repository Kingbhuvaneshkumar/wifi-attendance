const fs = require('fs');
const path = require('path');

// usage: node setEnv.js "MONGO_URI=your_uri_here"
const raw = process.argv[2];
if (!raw) {
  console.error('Usage: node setEnv.js "MONGO_URI=..."');
  process.exit(1);
}

const envPath = path.join(__dirname, '.env');
let content = '';
if (fs.existsSync(envPath)) content = fs.readFileSync(envPath, 'utf8');

const [key, ...rest] = raw.split('=');
const value = rest.join('=');
if (!key || !value) {
  console.error('Invalid argument');
  process.exit(1);
}

const regex = new RegExp(`^${key}=.*$`, 'm');
if (regex.test(content)) {
  content = content.replace(regex, `${key}=${value}`);
} else {
  if (content && !content.endsWith('\n')) content += '\n';
  content += `${key}=${value}\n`;
}

fs.writeFileSync(envPath, content, 'utf8');
console.log(`Wrote ${key} to ${envPath}`);