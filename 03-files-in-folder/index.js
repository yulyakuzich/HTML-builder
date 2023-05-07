const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), 
  { withFileTypes: true },
  (err, files) => {
  console.log("\nCurrent directory files:");
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
        let size = 0
        size = stats.size;
        let info = `name: ${file.name}, type: ${path.extname(file.name)}, size ${size} bite`
        console.log(info);
      });
      
    })
  }
})
