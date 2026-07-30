// Middleware genérico de validación de campos requeridos en el body.
function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => {
      const value = req.body ? req.body[field] : undefined;
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        camposFaltantes: missing,
      });
    }

    next();
  };
}

module.exports = { requireFields };
