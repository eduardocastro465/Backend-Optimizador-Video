import pool from "../../config/db.js";
import { RegisterBody } from "../../schemas/auth/auth.schema.js";

type PerfilData = NonNullable<RegisterBody["perfilUser"]>;

const PerfilUsuarioModel = {
  getAll: async () => {
    const { rows } = await pool.query(`
            SELECT id, user_id, first_name, last_name, birth_date, phone, gender, country, created_at
            FROM tblUser_profiles
        `);
    return rows;
  },

  getById: async (id: string | number) => {
    const { rows } = await pool.query(
      `
            SELECT id, user_id, first_name, last_name, birth_date, phone, gender, country, created_at
            FROM tblUser_profiles
            WHERE id = $1
        `,
      [id],
    );
    return rows[0];
  },

  getByUserId: async (user_id: string | number) => {
    const { rows } = await pool.query(
      `
            SELECT id, user_id, first_name, last_name, birth_date, phone, gender, country, created_at
            FROM tblUser_profiles
            WHERE user_id = $1
        `,
      [user_id],
    );
    return rows[0];
  },

  create: async (
    user_id: string | number,
    { firstName, lastName, birthDate, phone, gender, country }: PerfilData,
  ) => {
    const { rows } = await pool.query(
      `
            INSERT INTO tblUser_profiles (user_id, first_name, last_name, birth_date, phone, gender, country)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `,
      [user_id, firstName, lastName, birthDate, phone, gender, country],
    );
    return rows[0].id;
  },

  update: async (
    user_id: string | number,
    { firstName, lastName, birthDate, phone, gender, country }: PerfilData,
  ) => {
    await pool.query(
      `
            UPDATE tblUser_profiles
            SET first_name = $1, last_name = $2, birth_date = $3, phone = $4, gender = $5, country = $6
            WHERE user_id = $7
        `,
      [firstName, lastName, birthDate, phone, gender, country, user_id],
    );
  },

  delete: async (user_id: string | number) => {
    await pool.query("DELETE FROM tblUser_profiles WHERE user_id = $1", [
      user_id,
    ]);
  },
};

export default PerfilUsuarioModel;
