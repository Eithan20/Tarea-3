// ---------- Elementos ----------
const loginView = document.getElementById('login-view');
const appView = document.getElementById('app-view');
const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginError = document.getElementById('login-error');
const welcomeText = document.getElementById('welcome-text');
const logoutBtn = document.getElementById('logout-btn');

const form = document.getElementById('task-form');
const input = document.getElementById('task-title');
const categorySelect = document.getElementById('task-category');
const categoryForm = document.getElementById('category-form');
const categoryNameInput = document.getElementById('category-name');
const list = document.getElementById('task-list');
const counter = document.getElementById('counter');
const emptyState = document.getElementById('empty-state');
const errorMessage = document.getElementById('error-message');

let allTasks = [];
let allCategories = [];

// ---------- Sesión (token guardado en el navegador) ----------

function getSession() {
  const raw = localStorage.getItem('session');
  return raw ? JSON.parse(raw) : null;
}

function setSession(session) {
  localStorage.setItem('session', JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem('session');
}

function showApp(session) {
  loginView.hidden = true;
  appView.hidden = false;
  welcomeText.textContent = `Hola, ${session.user.name} — Programación III`;
  loadCategories();
  loadTasks();
}

function showLogin() {
  appView.hidden = true;
  loginView.hidden = false;
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.hidden = true;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: loginEmail.value.trim(),
      password: loginPassword.value,
    }),
  });
  const data = await res.json();

  if (!res.ok) {
    loginError.textContent = data.error || 'No se pudo iniciar sesión.';
    loginError.hidden = false;
    return;
  }

  setSession(data);
  loginPassword.value = '';
  showApp(data);
});

logoutBtn.addEventListener('click', () => {
  clearSession();
  showLogin();
});

// ---------- Categorías ----------

async function loadCategories() {
  const res = await fetch('/api/categories');
  allCategories = await res.json();

  categorySelect.innerHTML = '<option value="">Sin categoría</option>';
  allCategories.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  });
}

categoryForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = categoryNameInput.value.trim();
  if (!name) return;

  await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  categoryNameInput.value = '';
  await loadCategories();
});

function categoryName(categoryId) {
  const cat = allCategories.find((c) => c.id === Number(categoryId));
  return cat ? cat.name : null;
}

// ---------- Tareas ----------

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  input.classList.add('invalid');
}

function clearError() {
  errorMessage.hidden = true;
  input.classList.remove('invalid');
}

async function loadTasks() {
  const res = await fetch('/api/tasks');
  allTasks = await res.json();

  list.innerHTML = '';
  emptyState.hidden = allTasks.length > 0;
  counter.textContent = `${allTasks.length} tarea${allTasks.length === 1 ? '' : 's'}`;

  allTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' done' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTask(task));

    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;

    const edit = document.createElement('button');
    edit.className = 'task-edit';
    edit.type = 'button';
    edit.title = 'Editar tarea';
    edit.textContent = '✎';
    edit.addEventListener('click', () => startEdit(task, title, li));

    const del = document.createElement('button');
    del.className = 'task-delete';
    del.textContent = '✕';
    del.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(title);

    const catName = categoryName(task.categoryId);
    if (catName) {
      const tag = document.createElement('span');
      tag.className = 'task-category';
      tag.textContent = catName;
      li.appendChild(tag);
    }

    li.appendChild(edit);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function startEdit(task, titleEl, li) {
  const editInput = document.createElement('input');
  editInput.className = 'task-edit-input';
  editInput.value = task.title;
  li.replaceChild(editInput, titleEl);
  editInput.focus();
  editInput.select();

  let done = false;
  const commit = async () => {
    if (done) return;
    done = true;
    const newTitle = editInput.value.trim();

    if (!newTitle || newTitle === task.title) {
      loadTasks();
      return;
    }

    const duplicate = allTasks.some(
      (t) => t.id !== task.id && t.title.trim().toLowerCase() === newTitle.toLowerCase()
    );
    if (duplicate) {
      alert('Ya existe una tarea con ese nombre.');
      loadTasks();
      return;
    }

    await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    loadTasks();
  };

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') editInput.blur();
    if (e.key === 'Escape') { done = true; loadTasks(); }
  });
  editInput.addEventListener('blur', commit);
}

async function toggleTask(task) {
  await fetch(`/api/tasks/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !task.done }),
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  const alreadyExists = allTasks.some(
    (task) => task.title.trim().toLowerCase() === title.toLowerCase()
  );
  if (alreadyExists) {
    showError('Ya existe una tarea con ese nombre.');
    return;
  }

  clearError();
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, categoryId: categorySelect.value || null }),
  });
  input.value = '';
  categorySelect.value = '';
  loadTasks();
});

input.addEventListener('input', clearError);

// ---------- Arranque ----------

const session = getSession();
if (session) {
  showApp(session);
} else {
  showLogin();
}
