const fs = require('fs');
const path = require('path');

fs.promises
  .readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((files) =>
    files.forEach((el) => {
      if (el.isFile()) {
        const way = path.join(__dirname, 'secret-folder', el['name']);
        let output = '';
        output += path.parse(way)['name'] + ' - ';
        output += path.parse(way)['ext'].slice(1) + ' - ';
        fs.stat(way, (err, stats) => {
          if (!err) {
            output += stats.size.toString() + ' bytes';
          }
          console.log(output);
        });
      }
    }),
  );
