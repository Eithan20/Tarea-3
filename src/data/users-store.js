// Usuario de prueba para la demo del login simulado.
const users = [
  { id: 1, email: 'admin@demo.com', password: '123456', name: 'Administrador' },
];

function findByEmail(email) {
  return users.find((u) => u.email === email);
}

module.exports = { findByEmail };
