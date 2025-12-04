const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const dbPath = path.join(__dirname, 'data', 'games.json');

// Функція читання бази
function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

// Функція запису бази
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// -------------------- ROUTES --------------------

// GET — всі ігри
app.get('/api/games', (req, res) => {
  res.json(readDB());
});

// GET — гра за ID
app.get('/api/games/:id', (req, res) => {
  const games = readDB();
  const game = games.find(g => g.id === Number(req.params.id));

  if (!game) return res.status(404).json({ message: 'Game not found' });

  res.json(game);
});

// POST — додати нову гру
app.post('/api/games', (req, res) => {
  const games = readDB();
  const { title, genre } = req.body;

  if (!title || !genre)
    return res.status(400).json({ message: 'Title and genre required' });

  const newGame = {
    id: games.length ? games[games.length - 1].id + 1 : 1,
    title,
    genre
  };

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

  const exists = games.some(g => g.id === id);
  if (!exists) return res.status(404).json({ message: 'Game not found' });

  games = games.filter(g => g.id !== id);
  writeDB(games);

  res.json({ message: 'Game deleted' });
});

// -------------------- START --------------------

app.listen(3000, () =>
  console.log('Server running at http://localhost:3000')
);
