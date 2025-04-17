document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const age = document.getElementById('age').value;
  const group = document.getElementById('group').value;

  let errors = [];

  if (name === '') {
    errors.push("Поле ім'я є обов'язковим.");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Email введено у неправильному форматі.");
  }
  if (password.length < 6) {
    errors.push("Пароль має містити не менше 6 символів.");
  }
  if (password !== confirmPassword) {
    errors.push("Паролі не збігаються.");
  }
  if (age < 10) {
    errors.push("Вік має бути не менше 10 років.");
  }
  if (group === '') {
    errors.push("Оберіть вашу групу.");
  }

  if (errors.length > 0) {
    alert(errors.join('\n'));
  } else {
    alert("Реєстрація успішна!");
  }
});