const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const { body, validationResult } = require('express-validator');

const { readUsers, writeUsers } = require('./utils/db');
const { isAuthenticated, isNotAuthenticated } = require('./middleware/auth');

const app = express();
const PORT = 3000;

// Налаштування
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Сесії
app.use(session({
  secret: 'super-secret-key-2025',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Flash доступний у всіх шаблонах
app.use((req, res, next) => {
  res.locals.flash = req.flash();
  next();
});

// ------------   РОЗДІЛ МАРШРУТІВ   ----------------

// Головна
app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.redirect('/login');
});

// ---------------- РЕЄСТРАЦІЯ ----------------

app.get('/register', isNotAuthenticated, (req, res) => {
  res.render('register');
});

app.post('/register',
  [
    body('name')
      .isLength({ min: 3, max: 30 })
      .withMessage('ПІБ має бути 3–30 символів'),
    body('email')
      .isEmail()
      .withMessage('Невірний email')
      .custom(value => {
        const users = readUsers();
        if (users.find(u => u.email === value)) {
          throw new Error('Email вже зареєстровано');
        }
        return true;
      }),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Пароль ≥ 6 символів'),
    body('passwordConfirm')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Паролі не збігаються')
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('error', errors.array().map(e => e.msg));
      return res.redirect('/register');
    }

    const { name, email, password } = req.body;
    const users = readUsers();

    const hash = bcrypt.hashSync(password, 12);

    users.push({
      id: Date.now(),
      name,
      email,
      password: hash
    });

    writeUsers(users);

    req.flash('success', 'Реєстрація успішна! Увійдіть.');
    res.redirect('/login');
  }
);

// ---------------- ЛОГІН ----------------

app.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login');
});

app.post('/login',
  [
    body('email').isEmail().withMessage('Введіть коректний email'),
    body('password').notEmpty().withMessage('Введіть пароль')
  ],
  (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errors.array().map(e => e.msg));
      return res.redirect('/login');
    }

    const { email, password } = req.body;
    const users = readUsers();

    const user = users.find(u => u.email === email);

    if (!user) {
      req.flash('error', 'Користувача не знайдено');
      return res.redirect('/login');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      req.flash('error', 'Невірний пароль');
      return res.redirect('/login');
    }

    // Створення сесії
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.redirect('/dashboard');
  }
);

// ---------------- DASHBOARD ----------------

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

// ---------------- LOGOUT ----------------

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// ----------------------------------------------------

app.listen(PORT, () =>
  console.log(`Server running → http://localhost:${PORT}`)
);
