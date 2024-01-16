const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const source = path.join(__dirname, 'assets');
const projectDist = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');

const proceedHtml = (template, index) => {
  let html = '';
  let templateReadStream = fs.createReadStream(template, { encoding: 'utf8' });
  templateReadStream.on('data', (chunk) => {
    html = chunk.toString();
  });
  templateReadStream.on('end', () => {
    fillIn(html, index);
  });
};

const fillIn = (html, js) => {
  let count = 0;
  let componentsObj = {};
  fsPromises.readdir(components).then((files) => {
    files.forEach((file) => {
      let componentsPath = path.join(components, file);
      let componentsTitle = file.replace(path.extname(file), '');
      componentsObj[componentsTitle] = '';
      fs.createReadStream(path.join(componentsPath))
        .on('data', (data) => {
          componentsObj[componentsTitle] += data.toString();
        })
        .on('end', () => {
          count++;
          if (count >= files.length) {
            for (let i in componentsObj) {
              html = html.replace('{{' + i + '}}', componentsObj[i]);
            }
            let htmlStream = fs.createWriteStream(js, { encoding: 'utf8' });
            htmlStream.write(html);
          }
        });
    });
  });
};

fs.rm(projectDist, { recursive: true, force: true }, () => {
  fsPromises.mkdir(projectDist, { recursive: true }).then(() => {
    combine(path.join(__dirname, 'project-dist/assets'));
    copyDir(source, path.join(projectDist, 'assets'), function (err) {
      if (err) throw err;
    });
    proceedHtml(
      path.join(__dirname, 'template.html'),
      path.join(projectDist, 'index.html'),
    );
  });
});

const combine = async () => {
  const writableStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist/style.css'),
  );
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });
  for await (const file of files) {
    const readableStream = fs.createReadStream(
      path.join(__dirname, 'styles', file.name),
    );
    file.isFile() && path.extname(file.name) === '.css'
      ? readableStream.pipe(writableStream)
      : null;
  }
};

const copyDir = (before, after) => {
  fsPromises.mkdir(after, { recursive: true }).then(() => {
    fsPromises.readdir(before).then((files) => {
      files.forEach((file) => {
        let srcFile = path.join(before, file);
        let distFile = path.join(after, file);
        fs.stat(srcFile, (err, stats) => {
          if (err) throw err;
          stats.isDirectory()
            ? copyDir(srcFile, distFile)
            : fs.createReadStream(srcFile).pipe(fs.createWriteStream(distFile));
        });
      });
    });
  });
};
