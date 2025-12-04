const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

const filePath = path.join(__dirname, '../data/tasks.json');

// Отримати всі завдання
router.get('/', async (req, res) => {
  const tasks = await fs.readJson(filePath);
  res.json(tasks);
});

// Отримати завдання за ID
router.get('/:id', async (req, res) => {
  const tasks = await fs.readJson(filePath);
  const task = tasks.find(t => t.id == req.params.id);

  if (!task) return res.status(404).json({ message: "Завдання не знайдено" });
  res.json(task);
});

// Додати нове завдання
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const tasks = await fs.readJson(filePath);

  const newTask = {
    id: Date.now(),
    title,
    description,
    status: "active"
  };

  tasks.push(newTask);
  await fs.writeJson(filePath, tasks, { spaces: 2 });

  res.json(newTask);
});

// Оновити завдання
router.put('/:id', async (req, res) => {
  const tasks = await fs.readJson(filePath);
  const task = tasks.find(t => t.id == req.params.id);

  if (!task) return res.status(404).json({ message: "Завдання не знайдено" });

  const { title, description, status } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;

  await fs.writeJson(filePath, tasks, { spaces: 2 });
  res.json(task);
});

// Видалити завдання
router.delete('/:id', async (req, res) => {
  let tasks = await fs.readJson(filePath);
  tasks = tasks.filter(t => t.id != req.params.id);

  await fs.writeJson(filePath, tasks, { spaces: 2 });
  res.json({ message: "Завдання видалено" });
});

module.exports = router;
