import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Request } from "express";
import pool from "../config/db.js";
import { modoProduction } from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFile = path.join(__dirname, "../logs/error.log");

// Asegurar que la carpeta logs existe
if (!fs.existsSync(path.dirname(logFile))) {
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
}

interface AppError extends Error {
  status?: number;
}

export const logError = async (
  error: AppError,
  req: Request | null = null,
  level = "error",
) => {
  const logData: Record<string, unknown> = {
    level: level,
    message: error.message || error,
    timestamp: new Date().toISOString(),
    path: req?.originalUrl || null,
    method: req?.method || null,
    status_code: error.status || 500,
    user_id: req?.user?.id || null,
    ip: req?.ip || req?.socket?.remoteAddress || null,
    user_agent: req?.headers?.["user-agent"] || null,
    stack: error.stack || null,
  };

  // Guardar body (sin datos sensibles)
  if (req?.body && req.method !== "GET") {
    const bodySanitizado = { ...req.body } as Record<string, unknown>;
    if (bodySanitizado.password) bodySanitizado.password = "***";
    if (bodySanitizado.newPassword) bodySanitizado.newPassword = "***";
    logData.body = JSON.stringify(bodySanitizado);
  }

  // GUARDAR EN ARCHIVO
  const logLine = JSON.stringify(logData, null, 2) + "\n---\n";
  fs.appendFileSync(logFile, logLine);

  // GUARDAR EN BASE DE DATOS
  try {
    await pool.query(
      `INSERT INTO tblLogs (level, message, path, method, status_code, user_id, ip, user_agent, body, stack)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        logData.level,
        logData.message,
        logData.path,
        logData.method,
        logData.status_code,
        logData.user_id,
        logData.ip,
        logData.user_agent,
        logData.body || null,
        logData.stack,
      ],
    );
  } catch (dbError) {
    fs.appendFileSync(logFile, `[ERROR BD] ${(dbError as Error).message}\n`);
  }

  // Mostrar en consola en desarrollo
  if (!modoProduction) {
    console.error(
      `ERROR: ${logData.message} | ${logData.path || ""} | ${logData.method || ""}`,
    );
  }
};

// Función para logs sin req (errores internos)
export const logSimple = async (message: string, level = "error") => {
  const logData = {
    level: level,
    message: message,
    timestamp: new Date().toISOString(),
  };

  // Guardar en archivo
  fs.appendFileSync(logFile, JSON.stringify(logData, null, 2) + "\n---\n");

  // Guardar en BD
  try {
    await pool.query(`INSERT INTO tblLogs (level, message) VALUES ($1, $2)`, [
      level,
      message,
    ]);
  } catch (dbError) {
    console.error("Error al guardar log:", (dbError as Error).message);
  }
};
