// Ініціалізація завдань із LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Оновлення LocalStorage
function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Відображення списку завдань
function renderTasks() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.className = "checkbox";
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      updateLocalStorage();
      renderTasks();
    });

    const taskText = document.createElement("span");
    taskText.textContent = `${task.text} (${new Date(task.date).toLocaleString()})`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Видалити";
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(t => t !== task);
      updateLocalStorage();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

// Додавання нового завдання
document.getElementById("todoForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const taskInput = document.getElementById("taskInput");
  const newTask = {
    text: taskInput.value,
    completed: false,
    date: new Date().toISOString()
  };

  tasks.push(newTask);
  updateLocalStorage();
  renderTasks();
  taskInput.value = "";
});

// Сортування списку за датою
document.getElementById("sortButton").addEventListener("click", function() {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  renderTasks();
});

// Відображення завдань при завантаженні сторінки
renderTasks();