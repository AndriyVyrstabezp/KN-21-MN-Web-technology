// Індивідуальне завдання: Рух кола та зміна кольору
document.getElementById('animateCircle').addEventListener('click', function() {
  const circle = document.querySelector('.circle');
  
  // Додаємо анімацію руху
  circle.style.animation = `moveCircle ${3 * 0.2}s linear infinite`; // animation-duration = N * 0.2s
  
  // Змінюємо колір кола кожні 3 секунди
  setInterval(() => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    circle.style.backgroundColor = randomColor;
  }, 3000); // Зміна кольору кожні 3 секунди
});