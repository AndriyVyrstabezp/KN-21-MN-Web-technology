async function loadGames() {
  const res = await fetch('/api/games');
  const data = await res.json();
  renderGames(data);
}

function renderGames(games) {
  const list = document.getElementById('gamesList');
  list.innerHTML = '';

  games.forEach(g => {
    const li = document.createElement('li');
    li.innerHTML = `
      <b>${g.title}</b> (${g.genre})
      <button onclick="deleteGame(${g.id})">Видалити</button>
    `;
    list.appendChild(li);
  });
}

async function addGame() {
  const title = document.getElementById('title').value;
  const genre = document.getElementById('genre').value;

  if (!title || !genre) return alert('Заповніть усі поля');

  await fetch('/api/games', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title, genre })
  });

  loadGames();
}

async function deleteGame(id) {
  await fetch(`/api/games/${id}`, { method: 'DELETE' });
  loadGames();
}

async function filterGames() {
  const search = document.getElementById('search').value.toLowerCase();
  const res = await fetch('/api/games');
  const data = await res.json();

  const filtered = data.filter(g => g.genre.toLowerCase().includes(search));
  renderGames(filtered);
}

loadGames();
