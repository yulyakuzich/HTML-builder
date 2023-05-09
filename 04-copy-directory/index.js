const fs = require('fs');
const path = require('path');

async function copyFolder() {
  const source = path.join(__dirname, 'files');
  const destination = path.join(__dirname, 'files-copy');

  try {
    if (await fs.promises.stat(destination)) {
      await fs.promises.rm(destination, { recursive: true });
    }
  } catch (err) {}

  await fs.promises.mkdir(destination);

  const files = await fs.promises.readdir(source, { withFileTypes: true });

  for (const file of files) {
    const sourcePath = path.join(source, file.name);
    const destPath = path.join(destination, file.name);

    if (file.isDirectory()) {
      await fs.promises.mkdir(destPath, { recursive: true });
      await copyFolderRecursive(sourcePath, destPath);
    } else {
      await fs.promises.copyFile(sourcePath, destPath);
    }
  }
}

copyFolder();







