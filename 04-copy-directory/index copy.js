const fsPromises = require('fs/promises');
const path = require('path');
const source = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsPromises.mkdir(dest, {recursive: true});
    const sourceFiles = await fsPromises.readdir(source);
    const destFiles = await fsPromises.readdir(dest);
    destFiles.forEach(async file => {
      if (!sourceFiles.includes(file)) {
        await fsPromises.unlink(path.join(dest, file));
      }
    });
    sourceFiles.forEach(async file => {
      await fsPromises.copyFile(path.join(source, file), path.join(dest, file));
    });
  } 
  catch (err) {
    console.error(err);
  }
}
copyDir();
