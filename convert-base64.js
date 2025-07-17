const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'service-account-key.json');
const serviceAccountContent = fs.readFileSync(serviceAccountPath, 'utf8');
const base64Content = Buffer.from(serviceAccountContent).toString('base64');

console.log('FIREBASE_SERVICE_ACCOUNT_B64=' + base64Content); 