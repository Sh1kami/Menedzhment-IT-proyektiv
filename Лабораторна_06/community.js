const form = document.querySelector('#feedback');
const scenario = document.querySelector('#scenario');
const feedback = document.querySelector('#feedback-text');
const status = document.querySelector('#feedback-status');
const list = document.querySelector('#feedback-list');
const storageKey = 'labqueue-pilot-feedback-v1';

function readEntries() {
  try {
    const entries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

function render(entries) {
  list.replaceChildren();
  for (const entry of entries) {
    const item = document.createElement('li');
    const title = document.createElement('strong');
    title.textContent = entry.scenario;
    item.append(title, document.createElement('br'), entry.text);
    list.append(item);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = feedback.value.trim();
  if (!text) {
    status.textContent = 'Опишіть очікуваний і фактичний результат.';
    feedback.focus();
    return;
  }

  const entries = [{scenario: scenario.value, text}, ...readEntries()];
  try {
    localStorage.setItem(storageKey, JSON.stringify(entries));
  } catch {
    status.textContent = 'Браузер не дозволив зберегти запис.';
    return;
  }
  render(entries);
  form.reset();
  status.textContent = 'Запис збережено в цьому браузері.';
});

render(readEntries());
