// Поточний список справ
let todos = [];

// Функція для заповнення таблиці справ
function populateTable() {
  const tableBody = document.getElementById("todosTable");
  tableBody.innerHTML = "";
  todos.forEach(todo => {
    const row = `<tr><td>${todo.id}</td><td>${todo.title}</td></tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

// Функція для завантаження даних з JSONPlaceholder
function fetchTodos() {
  fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
    .then(response => response.json())
    .then(data => {
      todos = data;
      populateTable();
    })
    .catch(error => {
      console.error('Помилка при завантаженні даних:', error);
    });
}

// Обробник для кнопки "Оновити"
document.getElementById("refreshButton").addEventListener("click", () => {
  fetchTodos();
});

// Обробник для додавання нової справи
document.getElementById("addTodoForm").addEventListener("submit", event => {
  event.preventDefault();

  const todoName = document.getElementById("todoName").value.trim();
  if (todoName === "") {
    alert("Назва справи не може бути порожньою");
    return;
  }

  const newTodo = { id: todos.length + 1, title: todoName };
  todos.push(newTodo);
  populateTable();

  // Очищення форми
  document.getElementById("addTodoForm").reset();
});

// Завантаження початкового списку при відкритті сторінки
fetchTodos();
