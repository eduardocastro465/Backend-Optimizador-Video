import pool from '../../config/db.js';

const UsuarioModel = {

    getAll: async () => {
        const { rows } = await pool.query(`
            SELECT
                u.id, u.photo, u.username, u.email, u.active, u.role_id, u.created_at,
                p.first_name, p.last_name, p.birth_date, p.phone
            FROM tblUsers u
            LEFT JOIN tblUser_profiles p ON p.user_id = u.id
            WHERE u.deleted_at IS NULL
        `);
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query(`
            SELECT
                u.id, u.photo, u.username, u.email, u.active, u.role_id, u.created_at,
                p.first_name, p.last_name, p.birth_date, p.phone
            FROM tblUsers u
            LEFT JOIN tblUser_profiles p ON p.user_id = u.id
            WHERE u.id = $1 AND u.deleted_at IS NULL
        `, [id]);
        return rows[0];
    },

    getByEmail: async (email) => {
        const { rows } = await pool.query(`
            SELECT
                u.id, u.photo, u.username, u.email, u.active, u.role_id, u.created_at,
                p.first_name, p.last_name, p.birth_date, p.phone
            FROM tblUsers u
            LEFT JOIN tblUser_profiles p ON p.user_id = u.id
            WHERE u.email = $1 AND u.deleted_at IS NULL
        `, [email]);
        return rows[0];
    },

    getByUsername: async (username) => {
        const { rows } = await pool.query(`
            SELECT
                u.id, u.photo, u.username, u.email, u.active, u.role_id, u.created_at,
                p.first_name, p.last_name, p.birth_date, p.phone
            FROM tblUsers u
            LEFT JOIN tblUser_profiles p ON p.user_id = u.id
            WHERE u.username = $1 AND u.deleted_at IS NULL
        `, [username]);
        return rows[0];
    },

    update: async (id, username, email) => {
        await pool.query(
            'UPDATE tblUsers SET username = $1, email = $2 WHERE id = $3',
            [username, email, id]
        );
    },

    updatePhoto: async (id, photo) => {
        await pool.query(
            'UPDATE tblUsers SET photo = $1 WHERE id = $2',
            [photo, id]
        );
    },

    softDelete: async (id) => {
        await pool.query(
            'UPDATE tblUsers SET deleted_at = NOW(), active = FALSE WHERE id = $1',
            [id]
        );
    },
};

export default UsuarioModel;