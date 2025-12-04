const express = require('express');
const path = require('path');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = 3000;

// Middleware для JSON
app.use(express.json());

// Middleware для логування
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Статичні файли
app.use(express.static(path.join(__dirname, 'public')));

// Маршрути API
app.use('/api/tasks', tasksRouter);

// Запуск сервера
app.listen(PORT, () => console.log(`Сервер запущено на http://localhost:${PORT}`));
