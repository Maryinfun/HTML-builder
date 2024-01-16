const fs = require('fs');
const path = require('path');
const writableStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist/bundle.css'),
);

const combine = async () => {
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });
  for await (const file of files) {
    const readableStream = fs.createReadStream(
      path.join(__dirname, 'styles', file.name),
    );
    if (file.isFile() && path.extname(file.name) === '.css') {
      readableStream.pipe(writableStream);
    }
  }
};

combine();