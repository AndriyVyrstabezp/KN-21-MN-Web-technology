# Міністерство освіти і науки України
# Львівський національний університет природокористування
### Факультет механіки, енергетики та інформаційних технологій
#### Кафедра інформаційних технологій

---

# Звіт

про виконання лабораторної роботи №7  
з дисципліни **«Веб технології та веб дизайн»**  
на тему:  
**Робота з JSON як базою даних у Node.js та Express.js**

**Виконав:** студент групи **КН-31**, Вирста Андрій  
**Прийняв:** викл. **Тарас Квасниця**  

**Львів --- 2025**

---

## Мета роботи

- Ознайомитися з принципами зберігання даних у JSON-файлах.  
- Навчитися зчитувати, змінювати та зберігати дані на сервері Node.js за допомогою модуля `fs`.  
- Реалізувати просту імітацію бази даних для REST API без використання зовнішніх СУБД.  
- Створити REST API для каталогу ігор (CRUD).  
- Розробити клієнтську частину з HTML, CSS та JS для роботи з API.  
- Налаштувати фільтрацію даних без перезавантаження сторінки.  

---

## Теоретичні відомості

### JSON
JSON (JavaScript Object Notation) — текстовий формат обміну даними, легкий для читання людиною та простий для обробки комп’ютером.  
Може виконувати роль простої бази даних у невеликих веб-додатках.  

Приклад `games.json`:
```json
[
  { "id": 1, "title": "Minecraft", "genre": "Sandbox" },
  { "id": 2, "title": "The Witcher 3", "genre": "RPG" },
  { "id": 3, "title": "танки", "genre": "онлайн симулятор" }
]
```

### Node.js та модуль fs
Модуль `fs` дозволяє зчитувати, записувати та обробляти файли у Node.js:
```javascript
const fs = require('fs');
const data = fs.readFileSync('data/games.json', 'utf8');
const games = JSON.parse(data);
games.push({ id: 4, title: 'New Game', genre: 'Action' });
fs.writeFileSync('data/games.json', JSON.stringify(games, null, 2));
```

### Express.js
Фреймворк для створення серверних додатків у Node.js.  
- Проста реалізація маршрутів (`GET`, `POST`, `PUT`, `DELETE`)  
- Робота з JSON-запитами (`express.json()`)  
- Підключення статичних файлів (`express.static`)  

### REST API та CRUD
| Метод | Дія |
|-------|-----|
| GET   | Читання даних |
| POST  | Створення запису |
| PUT/PATCH | Оновлення запису |
| DELETE | Видалення запису |

---

## Хід роботи

### 1. Структура проєкту
```
project/
├── data/
│   └── games.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── app.js
└── package.json
```

### 2. Ініціалізація Node.js
```bash
npm init -y
npm install express
```

### 3. Сервер (app.js)
```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const dbPath = path.join(__dirname, 'data', 'games.json');

function readDB() { return JSON.parse(fs.readFileSync(dbPath, 'utf8')); }
function writeDB(data) { fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); }

// GET — всі ігри
app.get('/api/games', (req, res) => res.json(readDB()));

// GET — гра за ID
app.get('/api/games/:id', (req, res) => {
  const games = readDB();
  const game = games.find(g => g.id === Number(req.params.id));
  if (!game) return res.status(404).json({ message: 'Game not found' });
  res.json(game);
});

// POST — додати гру
app.post('/api/games', (req, res) => {
  const games = readDB();
  const { title, genre } = req.body;
  if (!title || !genre) return res.status(400).json({ message: 'Title and genre required' });
  const newGame = { id: games.length ? games[games.length-1].id + 1 : 1, title, genre };
  games.push(newGame);
  writeDB(games);
  res.json({ message: 'Game added', game: newGame });
});

// PUT — оновити гру
app.put('/api/games/:id', (req, res) => {
  const games = readDB();
  const id = Number(req.params.id);
  const game = games.find(g => g.id === id);
  if (!game) return res.status(404).json({ message: 'Game not found' });
  const { title, genre } = req.body;
  if (title) game.title = title;
  if (genre) game.genre = genre;
  writeDB(games);
  res.json({ message: 'Game updated', game });
});

// DELETE — видалити гру
app.delete('/api/games/:id', (req, res) => {
  let games = readDB();
  const id = Number(req.params.id);
  if (!games.some(g => g.id === id)) return res.status(404).json({ message: 'Game not found' });
  games = games.filter(g => g.id !== id);
  writeDB(games);
  res.json({ message: 'Game deleted' });
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
```

### 4. Клієнтська частина
- **index.html**, **style.css**, **script.js**:  
  - Форма для додавання ігор  
  - Список ігор із кнопками для видалення  
  - Фільтрація за жанром  
  - Fetch API для взаємодії з сервером  

### 5. Тестування
- ✔ Запуск сервера  
- ✔ Додавання/редагування/видалення гри  
- ✔ Відображення списку  
- ✔ Фільтрація за жанром  
- ✔ Оновлення JSON-файлу  

---

## Результати роботи
- REST API для каталогу ігор реалізовано  
- CRUD-операції працюють коректно  
- Дані зберігаються у `games.json`  
- Клієнтська частина відображає список ігор без перезавантаження  
- Структура проєкту оптимізована для розширення  

---

## Висновки
- Освоєно роботу з JSON у Node.js  
- Реалізовано REST API та CRUD для каталогу ігор  
- Створено клієнтську частину для взаємодії з API  
- Отримано практичні навички роботи з файловою системою та Fetch API  

---

## Контрольні питання та відповіді

**1. Що таке JSON і які його основні переваги?**  
JSON — легкий текстовий формат обміну даними, зрозумілий людині та легко парситься комп’ютером.  

**2. Як виконати читання JSON-файлу у Node.js?**  
```javascript
const fs = require('fs');
const data = fs.readFileSync('data/games.json', 'utf8');
const obj = JSON.parse(data);
```

**3. Для чого використовується модуль fs?**  
Для роботи з файлами: читання, запис, створення, видалення та оновлення даних.  

**4. Які HTTP-методи підтримуються у REST API?**  
GET, POST, PUT/PATCH, DELETE  

**5. Як налаштувати Express для роздачі статичних файлів?**  
```javascript
app.use(express.static('public'));
```

**6. Чим відрізняються методи readFileSync і readFile?**  
- `readFileSync` — синхронне, блокує виконання коду  
- `readFile` — асинхронне, не блокує код  

**7. Які переваги використання JSON як локальної бази даних?**  
Простота, легкість читання та редагування, не потребує СУБД  

**8. Які обмеження має цей підхід?**  
Не підходить для великих даних, відсутній конкурентний доступ, немає складних запитів  

**9. Чому важливо обробляти помилки при читанні та записі файлів?**  
Щоб уникнути збоїв при відсутності файлу, некоректному JSON або помилках доступу  
