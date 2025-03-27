// Зміна тексту при натисканні кнопки
document.getElementById('change-text-btn').addEventListener('click', function() {
    const textElement = document.getElementById('text');
    textElement.textContent = 'Текст успішно змінено!';
});

// Додавання нових елементів
document.getElementById('add-element-btn').addEventListener('click', function() {
    const container = document.getElementById('dynamic-elements');
    const newElement = document.createElement('p');
    newElement.textContent = 'Новий елемент доданий!';
    container.appendChild(newElement);
});

// Обробка кліку на кнопку з підрахунком
let clickCount = 0;
const maxClicks = 5; // Номер варіанту
document.getElementById('variant-btn').addEventListener('click', function() {
    clickCount++;
    if (clickCount === maxClicks) {
        alert('Андрій Ваш варіант номер ' + maxClicks + '!');
        clickCount = 0; // Скидаємо лічильник
    }
});

// Зміна стилю при наведенні курсору
document.getElementById('text').addEventListener('mouseover', function() {
    this.classList.add('hovered');
});
document.getElementById('text').addEventListener('mouseout', function() {
    this.classList.remove('hovered');
});