const tasks = [
  [
    "LQ-21",
    "Каталог і фільтр",
    "Розробка",
    "UX",
    "2026-11-25",
    "До роботи"
  ],
  [
    "LQ-22",
    "Перегляд слотів",
    "Розробка",
    "Розробник",
    "2026-11-27",
    "До роботи"
  ],
  [
    "LQ-23",
    "Правила допуску",
    "Розробка",
    "Аналітик",
    "2026-11-27",
    "На перевірці"
  ],
  [
    "LQ-24",
    "Атомарне бронювання",
    "Розробка",
    "Розробник",
    "2026-12-01",
    "У роботі"
  ],
  [
    "LQ-25",
    "Черга майстра",
    "Розробка",
    "Розробник",
    "2026-12-03",
    "До роботи"
  ],
  [
    "LQ-27",
    "Скасування заявки",
    "Розробка",
    "Розробник",
    "2026-12-04",
    "До роботи"
  ],
  [
    "QA-01",
    "Дві одночасні заявки",
    "Якість",
    "QA",
    "2026-12-02",
    "До роботи",
    "LQ-24"
  ],
  [
    "QA-02",
    "Прострочений допуск",
    "Якість",
    "QA",
    "2026-12-02",
    "У роботі",
    "LQ-23"
  ],
  [
    "QA-03",
    "Мобільний сценарій",
    "Якість",
    "UX",
    "2026-12-04",
    "До роботи",
    "LQ-22"
  ],
  [
    "QA-04",
    "Звільнення слота",
    "Якість",
    "QA",
    "2026-12-07",
    "До роботи",
    "LQ-27"
  ]
];
const statuses = ['До роботи','У роботі','На перевірці','Готово'];
const board = document.querySelector('#board');
const query = document.querySelector('#query');
const message = document.querySelector('#message');
const columns = document.querySelector('#columns');
const storageKey = 'labqueue-kanban-v1';
const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');

function remember() {
  localStorage.setItem(storageKey, JSON.stringify(saved));
}

function element(tag, value) {
  const node = document.createElement(tag);
  node.textContent = value;
  return node;
}

function statusFor(task) {
  return saved[task[0]]?.status ?? task[5];
}

function render(focusId) {
  const search = query.value.trim().toLocaleLowerCase('uk');
  const current = tasks.filter((task) => task[2] === board.value);
  columns.replaceChildren();
  for (const status of statuses) {
    const column = element('section', '');
    const visible = current.filter((task) => statusFor(task) === status
      && `${task[0]} ${task[1]}`.toLocaleLowerCase('uk').includes(search));
    column.append(element('h2', `${status} · ${visible.length}`));
    for (const task of visible) {
      const [id, title, , owner, due, , related] = task;
      const card = element('article', '');
      card.append(element('h3', `${id} · ${title}`), element('p', `${owner} · ${due}`));
      if (related) card.append(element('p', `Пов’язана картка: ${related}`));
      const checklist = element('label', '');
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = Boolean(saved[id]?.checked);
      check.addEventListener('change', () => {
        saved[id] = {...saved[id], checked: check.checked};
        remember();
      });
      checklist.append(check, ' Критерії перевірено');
      const select = element('select', '');
      select.id = `status-${id}`;
      select.setAttribute('aria-label', `Стан ${id}`);
      for (const option of statuses) select.add(new Option(option, option, false, option === status));
      select.addEventListener('change', () => {
        if (select.value === 'У роботі' && current.filter((t) => statusFor(t) === select.value).length >= 2) {
          select.value = status;
          message.textContent = 'У роботі вже дві картки.';
          return;
        }
        saved[id] = {...saved[id], status: select.value};
        remember();
        message.textContent = `${id} переміщено в «${select.value}».`;
        render(id);
      });
      card.append(checklist, select);
      column.append(card);
    }
    columns.append(column);
  }
  if (focusId) document.getElementById(`status-${focusId}`)?.focus();
}
board.addEventListener('change', () => { message.textContent = ''; render(); });
query.addEventListener('input', () => render());
render();
