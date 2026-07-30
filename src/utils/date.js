function formatDate(date = new Date()) {
  // FIX: getMonth() devuelve el mes en base 0 (enero = 0),
  // por lo que se suma 1 para mostrar el mes correcto (1-12).
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

module.exports = { formatDate };
