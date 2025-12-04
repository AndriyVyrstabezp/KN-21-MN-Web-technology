// Спільний клієнтський скрипт: обробляє реєстрацію, вхід, та дашборд
async function api(path, opts) {
  const res = await fetch(path, opts);
  return res.json();
}

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(registerForm);
    const body = { name: fd.get('name'), email: fd.get('email'), password: fd.get('password') };
    const res = await api('/api/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
    if (res.success) window.location = '/dashboard.html';
    else alert(JSON.stringify(res.errors || res));
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(loginForm);
    const body = { email: fd.get('email'), password: fd.get('password') };
    const res = await api('/api/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
    if (res.success) window.location = '/dashboard.html';
    else alert(JSON.stringify(res.errors || res));
  });
}

// Dashboard logic
if (document.location.pathname.endsWith('/dashboard.html')) {
  let chart = null;
  const welcome = document.getElementById('welcome');
  const logoutBtn = document.getElementById('logoutBtn');
  const tasksList = document.getElementById('tasksList');
  const taskForm = document.getElementById('taskForm');
  const filterButtons = document.querySelectorAll('#filters button');

  async function loadMe() {
    const res = await api('/api/me');
    if (res.user) welcome.innerText = `Вітаємо, ${res.user.name}!`;
    else window.location = '/login.html';
  }

  async function loadTasks() {
    const tasks = await api('/api/tasks');
    renderTasks(tasks);
    updateChart(tasks);
    return tasks;
  }

  function renderTasks(tasks) {
    tasksList.innerHTML = '';
    tasks.forEach(t => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${t.title} [${t.priority}]</span>
        <button data-action="toggle" data-id="${t.id}">${t.completed ? '↺' : '✓'}</button>
        <button data-action="delete" data-id="${t.id}">Видалити</button>`;
      tasksList.appendChild(li);
    });
  }

  async function updateChart(tasks) {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const ctx = document.getElementById('chart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Виконано','Не виконано'],
        datasets: [{ data: [completed, total-completed] }]
      }
    });
  }

  taskForm.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(taskForm);
    const body = { title: fd.get('title'), priority: fd.get('priority') };
    await api('/api/tasks', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    taskForm.reset();
    await loadTasks();
  });

  tasksList.addEventListener('click', async e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === 'delete') {
      await api('/api/tasks/' + id, { method: 'DELETE' });
    } else if (action === 'toggle') {
      // get tasks, find current state
      const tasks = await api('/api/tasks');
      const t = tasks.find(x=>x.id==id);
      if (t) await api('/api/tasks/' + id, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ completed: !t.completed }) });
    }
    await loadTasks();
  });

  filterButtons.forEach(b => b.addEventListener('click', async () => {
    const mode = b.dataset.filter;
    let tasks = await api('/api/tasks');
    if (mode === 'done') tasks = tasks.filter(t=>t.completed);
    if (mode === 'not') tasks = tasks.filter(t=>!t.completed);
    renderTasks(tasks);
    updateChart(tasks);
  }));

  logoutBtn.addEventListener('click', async () => {
    await api('/api/logout');
    window.location = '/';
  });

  // init
  loadMe().then(loadTasks);
}
