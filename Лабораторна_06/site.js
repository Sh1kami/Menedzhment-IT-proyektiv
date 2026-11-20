const countdown = document.querySelector('#countdown');
const pilotDate = Date.parse('2026-12-01T08:00:00Z');
const signupKey = 'labqueue-pilot-signups-v1';

function subscribe(address) {
  const entries = JSON.parse(localStorage.getItem(signupKey) || '[]');
  if (entries.includes(address)) return false;
  localStorage.setItem(signupKey, JSON.stringify([...entries, address]));
  return true;
}

for (const form of document.querySelectorAll('.signup')) {
  const email = form.querySelector('input');
  const status = form.querySelector('.signup-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const address = email.value.trim().toLowerCase();
    const valid = /^[a-z0-9._+-]+@example\.test$/.test(address);
    status.classList.toggle('error', !valid);
    if (!valid) {
      status.textContent = 'Введіть адресу в домені example.test.';
      email.focus();
      return;
    }

    try {
      status.textContent = subscribe(address)
        ? 'Демопідписку збережено в цьому браузері.'
        : 'Ця навчальна адреса вже є у списку.';
      form.reset();
    } catch {
      status.classList.add('error');
      status.textContent = 'Браузер не дозволив зберегти демопідписку.';
    }
  });
}

function updateCountdown() {
  const minutes = Math.max(0, Math.ceil((pilotDate - Date.now()) / 60000));
  if (minutes === 0) {
    countdown.textContent = 'Запланований час запуску настав.';
    return;
  }
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  countdown.textContent = `${days} д ${hours} год ${minutes % 60} хв до запуску пілота`;
}
updateCountdown();
setInterval(updateCountdown, 60000);
