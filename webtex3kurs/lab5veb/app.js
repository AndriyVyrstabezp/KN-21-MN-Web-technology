const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const studentFile = 'student.json';

// Дані студента за замовчуванням
const defaultStudent = {
  name: "Андрій",
  group: "КН-31",
  message: "Я вчуся працювати з Express.js!"
};

// --- Створення student.json при першому запуску ---
if (!fs.existsSync(studentFile)) {
  fs.writeFileSync(studentFile, JSON.stringify(defaultStudent, null, 2), 'utf-8');
  console.log("Файл student.json створено.");
}

// --- Маршрути ---
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/student', (req, res) => {
  const data = JSON.parse(fs.readFileSync(studentFile, 'utf-8'));
  res.send(`
    <h1>Інформація про студента</h1>
    <p><strong>Ім'я:</strong> ${data.name}</p>
    <p><strong>Група:</strong> ${data.group}</p>
    <p><strong>Повідомлення:</strong> ${data.message}</p>
    <a href="/update">✏️ Редагувати дані</a>
  `);
});

app.get('/json', (req, res) => {
  const data = JSON.parse(fs.readFileSync(studentFile, 'utf-8'));
  res.json(data);
});

// --- Сторінка редагування ---
app.get('/update', (req, res) => {
  res.sendFile(__dirname + '/public/update.html');
});

// --- Обробка форми для оновлення ---
app.post('/update', (req, res) => {
  const updatedData = {
    name: req.body.name,
    group: req.body.group,
    message: req.body.message
  };

  fs.writeFileSync(studentFile, JSON.stringify(updatedData, null, 2), 'utf-8');
  res.redirect('/student');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер працює: http://localhost:${PORT}`);
});
