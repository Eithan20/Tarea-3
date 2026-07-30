const express = require('express');
const { requireFields } = require('../middleware/validate');

const router = express.Router();

let categories = [
  { id: 1, name: 'Trabajo' },
  { id: 2, name: 'Personal' },
];
let nextId = 3;

// GET /api/categories - listar categorías
router.get('/', (req, res) => {
  res.json(categories);
});

// POST /api/categories - crear categoría (con validación de entrada)
router.post('/', requireFields(['name']), (req, res) => {
  const category = { id: nextId++, name: req.body.name };
  categories.push(category);
  res.status(201).json(category);
});

module.exports = { path: '/api/categories', router };
