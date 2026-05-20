import pg from 'pg';
import 'dotenv/config';
import { modoProduction,DATABASE_URL } from '../config.js';
import { textoColorido } from '../utils/colorText.js';
import { LOG_MESSAGES } from '../constants/logMessages.js';
import { formatearFecha } from '../utils/formateo.js';

const { Pool } = pg;

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20, // Máximo de clientes en el pool (optimización)
    idleTimeoutMillis: 30000, // Cerrar clientes inactivos después de 30 seg
    connectionTimeoutMillis: 15000, // Timeout para conectarse (evita timeout por arranque en frío de Neon)
});

pool.connect()
    .then(client => {
        textoColorido(
            LOG_MESSAGES.DB_CONECTADA(formatearFecha()),
            ["rgb(60, 255, 0)", "rgb(9, 108, 20)"],
            modoProduction
        );
        client.release();
    })
    .catch(err => {
        const mensajeError = err.message || err.code || LOG_MESSAGES.DB_ERROR_DESCONOCIDO;
        textoColorido(
            LOG_MESSAGES.DB_ERROR_CONEXION(mensajeError),
            ["rgb(255, 0, 0)", "rgb(255, 69, 0)"],
            modoProduction
        );
        process.exit(1);
    });

export default pool;