const express = require('express');
const fs = require('fs');
const path = require('path');
const { formatDate } = require('./utils/date');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Carga automática de cualquier módulo de ruta dentro de src/routes.
// Cada módulo debe exportar { path: '/api/algo', router }.
// Esto permite que cada feature agregue su propio archivo de rutas
// sin necesidad de modificar este archivo (evita conflictos de merge).
const routesDir = path.join(__dirname, 'routes');
if (fs.existsSync(routesDir)) {
  fs.readdirSync(routesDir)
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
      const route = require(path.join(routesDir, file));
      if (route && route.path && route.router) {
        app.use(route.path, route.router);
      }
    });
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'gestor-tareas-crud',
    serverDate: formatDate(new Date()),
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
