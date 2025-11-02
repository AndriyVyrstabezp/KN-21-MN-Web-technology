// Підключення модуля fs (файлова система)
const fs = require('fs');

// Зчитування даних із mydata.txt
fs.readFile('mydata.txt', 'utf8', (err, data) => {
  if (err) {
    console.error("Помилка при читанні файлу:", err);
    return;
  }

  // Додаємо новий рядок
  const updatedData = data + "\nНепарний варіант — додано студентом Вирста Андрій";

  // Запис у новий файл result.txt
  fs.writeFile('result.txt', updatedData, (err) => {
    if (err) {
      console.error("Помилка при записі файлу:", err);
      return;
    }
    console.log("✅ Файл result.txt створено успішно!");
  });
});
