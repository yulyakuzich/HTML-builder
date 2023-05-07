const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const readline = require('readline');
  
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
  
const fileStream = fs.createWriteStream(path.join(__dirname,'text.txt'));
  
console.log('Приветствую! Введите текст:');
  
rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Процесс завершен. До свидания!');
    fileStream.end();
    process.exit();
  } else {
    fileStream.write(input + '\n');
    console.log('Текст записан в файл.');
    console.log('Введите еще текст или введите "exit" для выхода:');
  }
});
