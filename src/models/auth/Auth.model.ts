import pool from "../../config/db.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../../libs/jwt.js";
import { ERROR_MESSAGES } from "../../constants/errors/errorMessages.erros.js";
import { RegisterBody } from "../../schemas/auth/auth.schema.js";

export const role_user_id = 3;

const AuthModel = {
  checkPermissions: async (roleId: number) => {
    const { rows } = await pool.query(
      `SELECT r.id, r.role, r.active
             FROM tblRoles r
             WHERE r.id = $1`,
      [roleId],
    );

    if (rows.length === 0) throw new Error(ERROR_MESSAGES.NO_ENCONTRADO("rol"));
    if (!rows[0].active) throw new Error(ERROR_MESSAGES.USUARIO_DESACTIVADO);

    return rows[0];
  },

  usernameExists: async (username: string) => {
    const { rows } = await pool.query(
      `SELECT id FROM tblUsers WHERE username = $1`,
      [username],
    );
    return rows.length > 0;
  },

  emailExists: async (email: string) => {
    const { rows } = await pool.query(
      `SELECT id FROM tblUsers WHERE email = $1`,
      [email],
    );
    return rows.length > 0;
  },

  saveEmailCode: async (email: string, code: string) => {
    await pool.query(
      `UPDATE tblVerification_codes SET used = TRUE WHERE email = $1 AND used = FALSE`,
      [email],
    );

    await pool.query(
      `INSERT INTO tblVerification_codes (email, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
      [email, code],
    );
  },

  verifyEmailCode: async (email: string, code: string) => {
    const { rows } = await pool.query(
      `SELECT * FROM tblVerification_codes
      WHERE email = $1 AND code = $2
        AND used = FALSE AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1`,
      [email, code],
    );
    return rows[0] ?? null;
  },

  markCodeAsUsed: async (id: number) => {
    await pool.query(
      `UPDATE tblVerification_codes SET used = TRUE WHERE id = $1`,
      [id],
    );
  },

  loginAuthGogle: async (
    nombre: string,
    apellidos: string,
    email: string,
    foto_perfil: string,
    sub: string
  ) => {
    // Busca si ya existe el usuario
    const existing = await pool.query(
      "SELECT * FROM tblUsers WHERE google_id = $1",
      [sub],
    );

    let userId: number;
    let username: string;
    let role_id: number;

    if (existing.rows.length === 0) {
      // Crea el usuario
      const newUser = await pool.query(
        `INSERT INTO tblUsers (photo, username, email, google_id, role_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role_id`,
        [foto_perfil, email.split("@")[0], email, sub, role_user_id],
      );

      userId = newUser.rows[0].id;
      username = newUser.rows[0].username;
      role_id = newUser.rows[0].role_id;

      // Crea el perfil
      await pool.query(
        `INSERT INTO tblUser_profiles (user_id, first_name, last_name, birth_date)
       VALUES ($1, $2, $3, '1900-01-01')`,
        [userId, nombre, apellidos],
      );
    } else {
      userId = existing.rows[0].id;
      username = existing.rows[0].username;
      role_id = existing.rows[0].role_id;
    }

    const payload = {
      id: userId,
      username,
      email,
      role_id,
      active: true,
    };

    const tokenAuth = await createAccessToken(payload);

    return {
      tokenAuth,
      user: {
        id: userId,
        username,
        email,
        role_id: role_id,
        active: true,
      },
    };
  },

  login: async (
    email: string | undefined,
    username: string | undefined,
    password: string,
  ) => {
    const { rows } = await pool.query(
      `SELECT
                u.id, u.username, u.email, u.password,
                u.active, u.role_id, r.role
             FROM tblUsers u
             LEFT JOIN tblRoles r ON u.role_id = r.id
             WHERE u.email = $1 OR u.username = $2`,
      [email, username],
    );

    if (rows.length === 0)
      throw new Error(ERROR_MESSAGES.CREDENCIALES_INCORRECTAS);

    const user = rows[0];

    if (!user.active) throw new Error(ERROR_MESSAGES.USUARIO_DESACTIVADO);

    if (!user.password) throw new Error(ERROR_MESSAGES.CUENTA_GOOGLE);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error(ERROR_MESSAGES.CREDENCIALES_INCORRECTAS);

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role_id: user.role_id,
      active: user.active,
    };

    return {
      token: await createAccessToken(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        active: user.active,
      },
    };
  },

  register: async (
    user: RegisterBody["user"],
    perfilUser: RegisterBody["perfilUser"],
  ) => {
    const { rows: existing } = await pool.query(
      `SELECT
      email = $1 AS email_taken,
      username = $2 AS username_taken
     FROM tblUsers
     WHERE email = $1 OR username = $2`,
      [user.email, user.username],
    );

    if (existing.length > 0) {
      const { email_taken, username_taken } = existing[0];
      if (email_taken) throw new Error(ERROR_MESSAGES.CORREO_YA_REGISTRADO);
      if (username_taken)
        throw new Error(ERROR_MESSAGES.USERNAME_YA_REGISTRADO(user.username));
    }

    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rows } = await client.query(
        `INSERT INTO tblUsers (username, email, password, role_id)
                 VALUES ($1, $2, $3, $4) RETURNING id`,
        [user.username, user.email, hashedPassword, role_user_id],
      );

      const userId = rows[0].id; // PostgreSQL usa RETURNING, no insertId

      if (perfilUser) {
        await client.query(
          `INSERT INTO tblUser_profiles
                        (first_name, last_name, birth_date, phone, gender, country, user_id)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            perfilUser.firstName,
            perfilUser.lastName,
            perfilUser.birthDate,
            perfilUser.phone,
            perfilUser.gender,
            perfilUser.country,
            userId,
          ],
        );
      }

      const payload = {
        id: rows[0].id,
        username: user.username,
        email: user.email,
        role_id: role_user_id,
        active: true,
      };

      const token = await createAccessToken(payload);

      await client.query("COMMIT");

      return {
        token,
        user: {
          id: rows[0].id,
          username: user.username,
          email: user.email,
          role_id: role_user_id,
          active: true,
        },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release(); // devuelve la conexión al pool
    }
  },

  changePassword: async (
    email: string | undefined,
    username: string | undefined,
    password: string,
    newPassword: string,
  ) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rows } = await client.query(
        `SELECT id, password FROM tblUsers WHERE email = $1 OR username = $2`,
        [email, username],
      );

      if (rows.length === 0)
        throw new Error(ERROR_MESSAGES.NO_ENCONTRADO("correo o usuario"));

      const isValidPassword = await bcrypt.compare(password, rows[0].password);
      if (!isValidPassword)
        throw new Error(ERROR_MESSAGES.CREDENCIALES_INCORRECTAS);

      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      await client.query(`UPDATE tblUsers SET password = $1 WHERE id = $2`, [
        newHashedPassword,
        rows[0].id,
      ]);

      await client.query("COMMIT");
      return true;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

export default AuthModel;
