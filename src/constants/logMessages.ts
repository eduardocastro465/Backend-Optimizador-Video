// Mis mensajes de log
// Aqui van los mensajes que se imprimen en consola al iniciar la aplicacion

export const LOG_MESSAGES = {
  DB_CONECTADA: (fecha: string) => [
    `   🚀 Base de datos conectada 💻`,
    ` Hora de conexión: ${fecha} `,
  ],
  DB_ERROR_CONEXION: (err: string) => [
    `🔥 ERROR: No se pudo conectar a la base de datos`,
    `Detalles: ${err}`,
  ],

  DB_ERROR_DESCONOCIDO: `Error desconocido`,

  TABLAS_LISTAS: [`    📦 Tablas listas 📝`],
  DB_ERROR_INIT: (err: string) => [
    `⚠️ ERROR: Fallo al inicializar la base de datos`,
    `Detalles: ${err}`,
  ],

  SERVIDOR_INICIADO: (port: number | string, production: boolean) => [
    ` 🌐 Servidor en modo ${production ? "🚀 Producción" : "Desarrollo 💻"}`,
    ` 🔥 API: http://localhost:${port} 📦 `,
  ],
};
