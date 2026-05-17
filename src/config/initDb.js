import pg from 'pg';
import { readFileSync } from 'fs';
import 'dotenv/config';
import { modoProduction } from '../config.js';
import { textoColorido } from '../utils/colorText.js';
import { LOG_MESSAGES } from '../constants/logMessages.js';

const { Client } = pg;


const readSql = (file) => {
  return readFileSync(new URL(`./tables/${file}`, import.meta.url), 'utf8'); //lee el archivo SQL
}

async function initDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Función compartida de updated_at (debe ir primero)
    await client.query(`
      CREATE OR REPLACE FUNCTION fn_update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    // Orden importa: respetar las foreign keys
    await client.query(readSql('log.sql'));
    await client.query(readSql('roles.sql'));
    await client.query(readSql('users.sql'));
    await client.query(readSql('verification_codes.sql'));
    await client.query(readSql('tasks.sql'));
    await client.query(readSql('attachments.sql'));

    textoColorido(
      LOG_MESSAGES.TABLAS_LISTAS,
      ["rgb(156, 60, 255)", "rgba(89, 0, 109, 1)"],
      modoProduction
    );

  } catch (error) {
    textoColorido(
      LOG_MESSAGES.DB_ERROR_INIT(error.message),
      ["rgb(255, 230, 0)", "rgb(180, 100, 0)"],
      modoProduction
    );
  } finally {
    await client.end();
  }
}

export default initDb;