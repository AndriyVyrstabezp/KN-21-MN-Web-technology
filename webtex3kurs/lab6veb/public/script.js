async function loadTasks() {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();

    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = "task";

        li.innerHTML = `
            <span class="${task.status === 'done' ? 'done' : ''}">
                <b>${task.title}</b> - ${task.description}
            </span>
            <div>
                <button onclick="toggleStatus(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">🗑</button>
            </div>
        `;

        list.appendChild(li);
    });
}

async function addTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });

    loadTasks();
}

async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
}

async function toggleStatus(id) {
    // Отримати завдання
    const res = await fetch(`/api/tasks/${id}`);
    const task = await res.json();

    const newStatus = task.status === 'active' ? 'done' : 'active';

    await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    });

    loadTasks();
}

loadTasks();
