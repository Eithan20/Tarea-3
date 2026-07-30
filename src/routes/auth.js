const express = require('express');
const users = require('../data/users-store');

const router = express.Router();

// POST /api/login - autenticación simulada (sin JWT real, solo demo)
router.post('/', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  const user = users.findByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.json({
    message: 'Autenticación exitosa',
    token: `demo-token-${user.id}`,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

module.exports = { path: '/api/login', router };
