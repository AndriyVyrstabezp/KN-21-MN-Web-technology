// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

// Дані про студента
const student = {
  name: "Андрій Вирста",
  group: "КН-31",
  message: "Я вчуся працювати з Node.js!"
};

// Шлях до JSON-файлу
const filePath = path.join(__dirname, 'student.json');

// Якщо файл ще не існує — створюємо його
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify(student, null, 2), 'utf8');
  console.log('Файл student.json створено.');
}

// Створюємо сервер
const server = http.createServer((req, res) => {
  console.log(`Отримано запит: ${req.url}`);

  if (req.url === '/' || req.url === '/index') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Головна сторінка</h1><p>Ласкаво просимо до мого Node.js сервера!</p>');
  } 
  else if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Про нас</h1><p>Це лабораторна робота №4 з Node.js</p>');
  } 
  else if (req.url === '/student') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(student, null, 2));
  } 
  else if (req.url === '/student/html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>Інформація про студента</h1>
      <table border="1" cellspacing="0" cellpadding="8">
        <tr><th>Ім'я</th><td>${student.name}</td></tr>
        <tr><th>Група</th><td>${student.group}</td></tr>
        <tr><th>Повідомлення</th><td>${student.message}</td></tr>
      </table>
    `);
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Сторінку не знайдено (404)</h1>');
  }
});

// Запуск сервера
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер працює на http://localhost:${PORT}`);
});
