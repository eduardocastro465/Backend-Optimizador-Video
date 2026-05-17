import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import { sanitizeHtml } from "./middlewares/sanitize.middleware.js";
import { generalLimiter } from "./middlewares/rateLimit.middleware.js";
import { modoProduction, PORT, CORS_ORIGINS } from './config.js';
import initDb from './config/initDb.js';
import { ERROR_MESSAGES } from './constants/errors/errorMessages.erros.js';
import { LOG_MESSAGES } from './constants/logMessages.js';
import { textoColorido } from './utils/colorText.js';
import { throwError } from './utils/asyncHandler.js';
import { errorHandler, jsonErrorHandler } from './middlewares/errorHandler.middleware.js';
import { verifyToken } from './middlewares/auth.middleware.js';
import { autorizar } from './middlewares/auth.middleware.js';
import { ROLES, ROLES_TODOS } from './constants/roles.js';

const app = express();

// Rutas
import authRoutes from './routes/auth/auth.routes.js';
import logRoutes from './routes/auth/logs.routes.js';
import rolesRoutes from './routes/auth/roles.routes.js';
import usuariosRoutes from './routes/user/usuario.routes.js';
import perfilUsuarioRoutes from './routes/user/perfilUsuario.routes.js';


// Rutas de CORS Válidas
const allowedOrigins = CORS_ORIGINS.split(',').map(origin => origin.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Middlewares de configuración
app.use(helmet()); // Seguridad de cabeceras HTTP
// app.use(generalLimiter); // Limita las peticiones globales para evitar abuso
app.use(express.json());
app.use(jsonErrorHandler);
app.use(cookieParser()); // Para manejar las cookies
app.use(express.urlencoded({ extended: true }));
app.use(morgan(modoProduction ? 'combined' : 'dev'));
app.use(sanitizeHtml) // Limpia del codigo html malicioso de las peticiones

// Rutas
app.use('/api/auth/roles',
  // verifyToken,
  //  autorizar(ROLES.Administrator),
  rolesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', verifyToken, autorizar(ROLES.Administrator), logRoutes);
app.use('/api/usuarios/perfiles', verifyToken, autorizar(ROLES_TODOS), perfilUsuarioRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.use((req, res, next) => {
  throwError(ERROR_MESSAGES.RUTA_NO_ENCONTRADA, 404);
});

// Middleware de manejo de errores
app.use(errorHandler);


// Inicializar base de datos
await initDb();

app.listen(PORT, () => textoColorido(
  LOG_MESSAGES.SERVIDOR_INICIADO(PORT, modoProduction),
  ["rgb(33, 97, 235)", "rgb(46, 15, 183)"],
  modoProduction
));