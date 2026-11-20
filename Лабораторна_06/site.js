const form = document.querySelector('#signup');
const email = document.querySelector('#email');
const status = document.querySelector('#status');
const countdown = document.querySelector('#countdown');
const demoDate = Date.parse('2026-12-01T08:00:00Z');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const address = email.value.trim();
  const valid = /^[a-z0-9._+-]+@example\.test$/i.test(address);
  status.classList.toggle('error', !valid);
  status.textContent = valid
    ? 'Демопідписку перевірено. Адресу не надіслано.'
    : 'Введіть адресу в домені example.test.';
  if (valid) form.reset();
  else email.focus();
});

function updateCountdown() {
  const minutes = Math.max(0, Math.ceil((demoDate - Date.now()) / 60000));
  if (minutes === 0) {
    countdown.textContent = 'Запланований час демонстрації настав.';
    return;
  }
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  countdown.textContent = `${days} д ${hours} год ${minutes % 60} хв до демо`;
}
updateCountdown();
setInterval(updateCountdown, 60000);
