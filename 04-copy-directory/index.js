const fs = require('fs');
const path = require('path');

async function copyFiles() {
  const srcDir = path.join(__dirname, 'files');
  const destDir = path.join(__dirname, 'files-copy');

  try {
    await fs.promises.access(destDir);
    console.log(`Папка ${destDir} уже существует`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.promises.mkdir(destDir);
      console.log(`Создана папка: ${destDir}`);
    } else {
      throw error;
    }
  }

  const files = await fs.promises.readdir(srcDir);

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    await fs.promises.copyFile(srcPath, destPath);
    console.log(`Файл ${file} скопирован в ${destDir}`);
  }
}

copyFiles();







