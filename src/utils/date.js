function formatDate(date = new Date()) {
  // NOTA: getMonth() devuelve el mes en base 0 (enero = 0).
  // Falta sumar 1, por lo que el mes mostrado queda incorrecto.
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

module.exports = { formatDate };
