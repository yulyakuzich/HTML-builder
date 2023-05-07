const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const destFile = path.join(__dirname, 'project-dist', 'bundle.css');

const readDir = async (dir) => {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  return Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? readDir(res) : res;
    })
  ).then((files) => files.flat());
};

(async () => {
  try {
    const files = await readDir(stylesDir);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const content = await Promise.all(
      cssFiles.map((file) => fs.promises.readFile(file, 'utf8'))
    );
    await fs.promises.writeFile(destFile, content.join('\n'));
    console.log(`Создан файл ${destFile}`);
  } catch (error) {
    console.error(error);
  }
})();