const express = require('express');
const store = require('../data/tasks-store');

const router = express.Router();

// GET /api/tasks - listar todas las tareas
router.get('/', (req, res) => {
  res.json(store.getAll());
});

// GET /api/tasks/:id - obtener una tarea
router.get('/:id', (req, res) => {
  const task = store.getById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.json(task);
});

// POST /api/tasks - crear una tarea
router.post('/', (req, res) => {
  if (!req.body || !req.body.title) {
    return res.status(400).json({ error: 'El campo "title" es obligatorio' });
  }
  if (store.getByTitle(req.body.title)) {
    return res.status(409).json({ error: 'Ya existe una tarea con ese nombre' });
  }
  const task = store.create(req.body);
  res.status(201).json(task);
});

// PUT /api/tasks/:id - actualizar una tarea
router.put('/:id', (req, res) => {
  const body = req.body || {};
  if (body.title !== undefined) {
    const existing = store.getByTitle(body.title);
    if (existing && String(existing.id) !== String(req.params.id)) {
      return res.status(409).json({ error: 'Ya existe una tarea con ese nombre' });
    }
  }
  const updated = store.update(req.params.id, body);
  if (!updated) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.json(updated);
});

// DELETE /api/tasks/:id - eliminar una tarea
router.delete('/:id', (req, res) => {
  const deleted = store.remove(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.status(204).send();
});

module.exports = { path: '/api/tasks', router };
