const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

// Middleware для парсингу форм
app.use(express.urlencoded({ extended: true }));

// Middleware логування
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
});

// Повертаємо HTML форму
app.use(express.static('public'));

// Валідація
const validatePurchase = [
  body('item')
    .notEmpty().withMessage('Назва товару обов’язкова.')
    .isLength({ min: 3, max: 50 }).withMessage('Назва 3–50 символів.'),
  
  body('quantity')
    .isInt({ min: 1 }).withMessage('Кількість має бути ≥ 1'),

  body('price')
    .isFloat({ min: 0.01 }).withMessage('Ціна має бути ≥ 0.01'),

  body('category')
    .notEmpty().withMessage('Категорія обовʼязкова.')
];

// POST: обробка форми
app.post('/add', validatePurchase, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Повернення форми з помилками
    return res.send(`
      <h2>Помилки:</h2>
      <ul>
        ${errors.array().map(err => `<li>${err.msg}</li>`).join('')}
      </ul>
      <a href="/form.html">Назад</a>
    `);
  }

  // Збереження у JSON
  let db = [];
  const file = path.join(__dirname, 'data.json');

  if (fs.existsSync(file)) {
    db = JSON.parse(fs.readFileSync(file));
  }

  db.push(req.body);

  fs.writeFileSync(file, JSON.stringify(db, null, 2));

  res.send(`
    <h2>Успіх! Дані збережено.</h2>
    <a href="/form.html">Додати новий товар</a>
  `);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
