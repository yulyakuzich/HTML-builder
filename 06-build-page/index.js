const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const templatePath = path.join(__dirname, 'template.html');
const componentsDirPath = path.join(__dirname, 'components');
const distDirPath = path.join(__dirname, 'project-dist');
const distFilePath = path.join(distDirPath, 'index.html');

// 1. Создание папки project-dist
fs.mkdir(distDirPath, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Folder project-dist created')})

//2
// Функция для чтения содержимого файла
function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

// Функция для записи данных в файл
function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Функция для замены шаблонных тегов на содержимое компонентов
async function replaceTemplateTags() {
  try {
    // Читаем шаблонный файл
    const templateContent = await readFile(templatePath);

    // Получаем список файлов в папке с компонентами
    const componentsFiles = await fs.promises.readdir(componentsDirPath);

    // Создаём папку для результатов, если она не существует
    // if (!fs.existsSync(distDirPath)) {
    //   fs.mkdirSync(distDirPath);
    // }

    // Заменяем теги в шаблонном файле на содержимое компонентов
    let resultContent = templateContent;
    for (const fileName of componentsFiles) {
      const componentName = path.parse(fileName).name;
      const componentContent = await readFile(path.join(componentsDirPath, fileName));
      const tagRegExp = new RegExp(`{{${componentName}}}`, 'g');
      resultContent = resultContent.replace(tagRegExp, componentContent);
    }

    // Сохраняем результат в файл
    await writeFile(distFilePath, resultContent);
    console.log('The template tags have been successfully replaced!');
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

// Запускаем функцию замены тегов
replaceTemplateTags();

//3

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist', 'style.css');

// создаем WriteStream для записи содержимого всех файлов стилей в единый файл
const distStream = fs.createWriteStream(distPath, { flags: 'a' });

// читаем содержимое папки styles
fs.readdir(stylesPath, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(stylesPath, file);

    // создаем ReadStream для чтения содержимого каждого файла стилей
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('error', (err) => {
      throw err;
    });

    // пишем содержимое каждого файла стилей в единый файл
    fileStream.pipe(distStream);
  });
});

// слушаем событие завершения записи в файл
distStream.on('finish', () => {
  console.log('All styles are collected and saved in style.css');
});

//4
async function copyFiles() {
  const srcAssetsDir = path.join(__dirname, 'assets');
  const destAssetsDir = path.join(__dirname, 'project-dist', 'assets');

  try {
    await fs.promises.access(destAssetsDir);
    console.log(`Папка ${destAssetsDir} уже существует`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.promises.mkdir(destAssetsDir);
      console.log(`Создана папка: ${destAssetsDir}`);
    } else {
      throw error;
    }
  }
  fs.cp(srcAssetsDir, path.join(__dirname, 'project-dist', 'assets'), { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

copyFiles();