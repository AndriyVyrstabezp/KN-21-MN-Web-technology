const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const path = require('path');
const db = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'replace_this_secret_for_production',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

// Middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ redirect: '/login.html' });
};

// Auth routes
app.post('/api/register', 
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const users = await db.read('data/users.json');
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ errors: [{ msg: 'Email вже зареєстрований' }] });
    }
    const hash = await bcrypt.hash(password, 12);
    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const user = { id, name, email, password: hash };
    users.push(user);
    await db.write('data/users.json', users);
    req.session.user = { id: user.id, name: user.name, email: user.email };
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  }
);

app.post('/api/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const users = await db.read('data/users.json');
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ errors: [{ msg: 'Невірний email або пароль' }] });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ errors: [{ msg: 'Невірний email або пароль' }] });

    req.session.user = { id: user.id, name: user.name, email: user.email };
    res.json({ success: true, user: req.session.user });
  }
);

app.get('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Не вдалось вийти' });
    res.json({ success: true });
  });
});

app.get('/api/me', isAuthenticated, (req, res) => {
  res.json({ user: req.session.user });
});

// Tasks CRUD
const taskValidation = [
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('priority').optional().isIn(['низька','середня','висока'])
];

app.get('/api/tasks', isAuthenticated, async (req, res) => {
  const tasks = await db.read('data/tasks.json');
  const userTasks = tasks.filter(t => t.userId === req.session.user.id);
  res.json(userTasks);
});

app.post('/api/tasks', isAuthenticated, taskValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const tasks = await db.read('data/tasks.json');
  const id = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const { title, priority } = req.body;
  const task = { id, userId: req.session.user.id, title, completed: false, createdAt: new Date().toISOString(), priority: priority || 'середня' };
  tasks.push(task);
  await db.write('data/tasks.json', tasks);
  res.json(task);
});

app.put('/api/tasks/:id', isAuthenticated, taskValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const tasks = await db.read('data/tasks.json');
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id && t.userId === req.session.user.id);
  if (!task) return res.status(404).json({ error: 'Завдання не знайдено' });

  const { title, completed, priority } = req.body;
  if (typeof title !== 'undefined') task.title = title;
  if (typeof completed !== 'undefined') task.completed = !!completed;
  if (typeof priority !== 'undefined') task.priority = priority;
  await db.write('data/tasks.json', tasks);
  res.json({ success: true, task });
});

app.delete('/api/tasks/:id', isAuthenticated, async (req, res) => {
  const tasks = await db.read('data/tasks.json');
  const id = Number(req.params.id);
  const idx = tasks.findIndex(t => t.id === id && t.userId === req.session.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Завдання не знайдено' });
  tasks.splice(idx,1);
  await db.write('data/tasks.json', tasks);
  res.json({ success: true });
});

// Serve dashboard protected file
app.get('/dashboard.html', (req, res, next) => {
  if (req.session && req.session.user) return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  res.redirect('/login.html');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
