let tasks = [
  { id: 1, title: 'Configurar repositorio Git', done: true },
  { id: 2, title: 'Diseñar modelo de datos', done: false },
];
let nextId = 3;

function getAll() {
  return tasks;
}

function getById(id) {
  return tasks.find((t) => t.id === Number(id));
}

function create(data) {
  const task = { id: nextId++, title: data.title, done: Boolean(data.done) || false };
  tasks.push(task);
  return task;
}

function update(id, data) {
  const task = getById(id);
  if (!task) return null;
  if (data.title !== undefined) task.title = data.title;
  if (data.done !== undefined) task.done = Boolean(data.done);
  return task;
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === Number(id));
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
