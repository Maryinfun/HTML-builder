const fs = require('fs');
const path = require('path');
const pathText = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathText, 'utf8');

readStream.on('data', (data) => process.stdout.write(data));