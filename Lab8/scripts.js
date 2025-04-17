// Початковий список адекватних справ
const initialTodos = [
  { id: 1, title: "Завершити читання книги" },
  { id: 2, title: "Прибрати кімнату" },
  { id: 3, title: "Купити продукти" },
  { id: 4, title: "Написати звіт для роботи" },
  { id: 5, title: "Полити рослини" },
  { id: 6, title: "Зробити зарядку" },
  { id: 7, title: "Відвідати лікаря" },
  { id: 8, title: "Спланувати відпустку" },
  { id: 9, title: "Зателефонувати другу" },
  { id: 10, title: "Приготувати вечерю" }
];

// Поточний список справ (може змінюватись)
let todos = [...initialTodos];

// Функція для заповнення таблиці справ
function populateTable() {
  const tableBody = document.getElementById("todosTable");
  tableBody.innerHTML = "";
  todos.forEach(todo => {
    const row = `<tr><td>${todo.id}</td><td>${todo.title}</td></tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

// Обробник для кнопки "Оновити"
document.getElementById("refreshButton").addEventListener("click", () => {
  todos = [...initialTodos]; // Скидання до початкового списку
  populateTable();
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
populateTable();