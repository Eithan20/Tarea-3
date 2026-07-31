const form = document.getElementById('task-form');
const input = document.getElementById('task-title');
const list = document.getElementById('task-list');
const counter = document.getElementById('counter');
const emptyState = document.getElementById('empty-state');
const errorMessage = document.getElementById('error-message');

let allTasks = [];

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
    body: JSON.stringify({ title }),
  });
  input.value = '';
  loadTasks();
});

input.addEventListener('input', clearError);

loadTasks();
