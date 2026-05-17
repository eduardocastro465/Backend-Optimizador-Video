import pool from '../../config/db.js';
import { ERROR_MESSAGES } from '../../constants/errors/errorMessages.erros.js';

const RolesModel = {

    getAll: async () => {
        const { rows } = await pool.query(
            'SELECT id, role, description, active, created_at FROM tblRoles ORDER BY id'
        );
        return rows;
    },

    getById: async (id) => {
        const { rows } = await pool.query(
            'SELECT id, role, description, active, created_at FROM tblRoles WHERE id = $1',
            [id]
        );
        return rows[0] || null;
    },

    create: async (role, description, active) => {

        const format_role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()

        const { rows: existe } = await pool.query(
            'SELECT id FROM tblRoles WHERE role = $1',
            [format_role]
        );

        if (existe.length > 0) {
            throw new Error(ERROR_MESSAGES.YA_EXISTE('rol'));
        }

        const { rows } = await pool.query(
            'INSERT INTO tblRoles (role, description, active) VALUES ($1, $2, $3) RETURNING id',
            [format_role, description, active]
        );

        return rows[0].id;
    },

    update: async (id, role, description, active) => {

        const format_role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()


        const { rowCount } = await pool.query(`
            UPDATE tblRoles
            SET role = $1,
                description = $2,
                active = $3
            WHERE id = $4
        `, [format_role, description, active, id]);

        if (rowCount === 0) {
            throw new Error(ERROR_MESSAGES.NO_EXISTE('rol'));
        }
        return { id, format_role, description, active };
    },

    toggleActivo: async (id, active) => {
        const { rowCount } = await pool.query(
            'UPDATE tblRoles SET active = $1 WHERE id = $2',
            [active, id]
        );
        return rowCount > 0;
    },

    delete: async (id) => {
        const { rowCount } = await pool.query(
            'DELETE FROM tblRoles WHERE id = $1',
            [id]
        );
        return rowCount > 0;
    },

};

export default RolesModel;