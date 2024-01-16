const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;
const file = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const finalText = () => stdout.write('\nBye! See you later.');

stdout.write('Hi, write something here:\n');
stdin.on('data', (text) => {
  if (text.toString().trim() === 'exit') {
    exit();
  }

  file.write(text);
});

process.on('exit', finalText);
process.on('SIGINT', exit);