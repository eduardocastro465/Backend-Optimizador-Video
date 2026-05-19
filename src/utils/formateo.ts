export function formatearFecha(fechaHora = new Date()) {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(fechaHora);
}