//Configuración del servidor
export const CORS_ORIGINS = process.env.CORS_ORIGINS || "http://localhost:5173,https://frontend-video-libre-dev.vercel.app/";
export const PORT = process.env.PORT || 3000;

//Configuración del modo de producción
export const modoProduction = process.env.NODE_ENV === "production";

//Configuración de la base de datos
export const DATABASE_URL = process.env.DATABASE_URL || ""//poner la ruta

//Credenciales
export const TOKEN_SECRET = process.env.TOKEN_SECRET || "token_adminis_tareas_1234";
export const JWT_SECRET = process.env.JWT_SECRET || "adminis_tareas_1234";