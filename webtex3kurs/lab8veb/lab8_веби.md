## Міністерство освіти і науки України

## Львівський національний університет природокористування

### Факультет механіки, енергетики та інформаційних технологій

#### Кафедра інформаційних технологій

------------------------------------------------------------------------

# **Звіт**

про виконання лабораторної роботи №8\
з дисципліни **«Веб технології та веб дизайн»**\
на тему:\
**Обробка форм, валідація даних та middleware у Express.js**

**Виконав:** студент групи **КН-31**, Вирста Андрій\
**Прийняв:** викл. **Тарас Квасниця**

**Львів --- 2025**

------------------------------------------------------------------------

## **Мета роботи**

-   Ознайомитися з принципами обробки HTML-форм у Express.js.\
-   Навчитися використовувати middleware та застосовувати його в обробці
    запитів.\
-   Застосувати *express-validator* для валідації даних.\
-   Реалізувати просту серверну валідацію та збереження даних у JSON.\
-   Закріпити навички роботи з POST-запитами та body-parser
    (express.urlencoded).

------------------------------------------------------------------------

## **Теоретичні відомості**

### **1. HTML-форми**

HTML-форма дозволяє надсилати дані на сервер:

``` html
<form action="/submit" method="POST">
  <input type="text" name="title">
  <button type="submit">Надіслати</button>
</form>
```

-   **method="GET"** --- дані у URL\
-   **method="POST"** --- дані в тілі запиту

------------------------------------------------------------------------

### **2. Парсинг тіла запиту у Express**

Express не читає тіло POST за замовчуванням. Для цього використовується
middleware:

``` js
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```

------------------------------------------------------------------------

### **3. Middleware**

Middleware --- це функція, що виконується між запитом і відповіддю.

``` js
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}
```

------------------------------------------------------------------------

### **4. Валідація даних**

Серверна валідація потрібна для:

-   захисту від помилок та неправильних даних;\
-   підтвердження коректності введення;\
-   безпеки та уникнення ін'єкцій.

------------------------------------------------------------------------

### **5. express-validator**

Популярна бібліотека для валідації.

``` bash
npm install express-validator
```

Приклад:

``` js
body('email').isEmail().withMessage("Некоректний email");
```

Перевірка помилок:

``` js
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
```

------------------------------------------------------------------------

# **Хід роботи**

------------------------------------------------------------------------

## **1. Структура проєкту**

    project/
     ├── public/
     │    └── form.html
     ├── data.json
     ├── app.js
     └── package.json

------------------------------------------------------------------------

## **2. Створення package.json**

``` json
{
  "name": "shopping-list",
  "version": "1.0.0",
  "main": "app.js",
  "type": "commonjs",
  "dependencies": {
    "express": "^4.19.0",
    "express-validator": "^7.0.1"
  }
}
```

------------------------------------------------------------------------

## **3. Реалізація сервера --- app.js**

``` javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = 3000;

// Парсинг форм
app.use(express.urlencoded({ extended: true }));

// Логування
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
});

// Статичні файли
app.use(express.static('public'));

const validatePurchase = [
  body('item')
    .notEmpty().withMessage('Назва товару обовʼязкова.')
    .isLength({ min: 3, max: 50 }).withMessage('Назва 3–50 символів.'),

  body('quantity')
    .isInt({ min: 1 }).withMessage('Кількість має бути ≥ 1'),

  body('price')
    .isFloat({ min: 0.01 }).withMessage('Ціна ≥ 0.01'),

  body('category')
    .notEmpty().withMessage('Категорія обов’язкова.')
];

app.post('/add', validatePurchase, (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send(`
      <h2>Помилки:</h2>
      <ul>
        ${errors.array().map(e => `<li>${e.msg}</li>`).join("")}
      </ul>
      <a href="/form.html">Назад</a>
    `);
  }

  const file = path.join(__dirname, 'data.json');
  let db = [];

  if (fs.existsSync(file)) {
    db = JSON.parse(fs.readFileSync(file));
  }

  db.push(req.body);
  fs.writeFileSync(file, JSON.stringify(db, null, 2));

  res.send(`
    <h2>Успіх! Дані збережено.</h2>
    <a href="/form.html">Додати ще</a>
  `);
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
```

------------------------------------------------------------------------

## **4. Форма --- form.html**

``` html
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Список покупок</title>
</head>
<body>
  <h1>Додати покупку</h1>

  <form action="/add" method="POST">

    <label>Назва товару:</label><br>
    <input type="text" name="item"><br><br>

    <label>Кількість:</label><br>
    <input type="number" name="quantity" min="1"><br><br>

    <label>Категорія:</label><br>
    <input type="text" name="category"><br><br>

    <label>Ціна (грн):</label><br>
    <input type="number" name="price" step="0.01"><br><br>

    <button type="submit">Додати</button>
  </form>

</body>
</html>
```

------------------------------------------------------------------------

## **5. Вміст data.json після тестування**

``` json
[
  {
    "item": "qwd",
    "quantity": "3",
    "category": "fc",
    "price": "33"
  },
  {
    "item": "банан",
    "quantity": "3",
    "category": "фрукти",
    "price": "33"
  }
]
```

------------------------------------------------------------------------

## **6. Тестування**

✔ Перевірено валідацію\
✔ Некоректні дані повертають повідомлення\
✔ Дані зберігаються у JSON\
✔ Логування працює\
✔ Форма відображається та працює\
✔ POST-запит обробляється коректно

------------------------------------------------------------------------

# **Результати роботи**

-   Створено сервер Express з обробкою POST-форм.\
-   Реалізовано middleware логування.\
-   Налаштовано парсинг form-data.\
-   Зроблено валідацію через express-validator.\
-   Реалізовано повернення помилок на сторінку.\
-   Дані успішно зберігаються у JSON-файл.

------------------------------------------------------------------------

# **Висновок**

У ході лабораторної роботи №8 було реалізовано повний цикл роботи із
HTML-формою:\
отримання → обробка → валідація → збереження → відповідь.\
Було закріплено навички створення middleware, роботи з body-parser та
валідації серверних даних.

------------------------------------------------------------------------

# **Контрольні питання**

### **1. Що таке middleware?**

Це функція, яка виконується між отриманням запиту та відправленням
відповіді.

### **2. Чим відрізняються express.json() та express.urlencoded()?**

-   `express.json()` --- читає JSON\
-   `express.urlencoded()` --- читає дані HTML-форм

### **3. Як працює validationResult()?**

Збирає всі помилки валідації та повертає їх у вигляді масиву.

### **4. Чому потрібна серверна валідація, навіть якщо є клієнтська?**

Клієнт можна обійти, сервер --- ні. Серверна валідація єдина гарантує
безпеку.

------------------------------------------------------------------------
