import pool from '../../config/db.js';

const LogModel = {

    getAll: async (limit = 100, offset = 0) => {
        const { rows } = await pool.query(
            'SELECT * FROM tblLogs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        return rows;
    },

    getById: async (id: string | number) => {
        const { rows } = await pool.query(
            'SELECT * FROM tblLogs WHERE id = $1',
            [id]
        );
        return rows[0];
    },

    getByUserId: async (userId: string | number) => {
        const { rows } = await pool.query(
            'SELECT * FROM tblLogs WHERE user_id = $1',
            [userId]
        );
        return rows;
    },

    getByDate: async (date: string) => {
        const { rows } = await pool.query(
            'SELECT * FROM tblLogs WHERE DATE(created_at) = $1',
            [date]
        );
        return rows;
    },

    getByDateRange: async (startDate: string, endDate: string) => {
        const { rows } = await pool.query(
            'SELECT * FROM tblLogs WHERE created_at BETWEEN $1 AND $2',
            [startDate, `${endDate} 23:59:59`]
        );
        return rows;
    },

    getByLevel: async (level: string) => {
        const { rows } = await pool.query(
            'SELECT * FROM tblLogs WHERE level = $1',
            [level]
        );
        return rows;
    },

    getByPath: async (path: string) => {
        const { rows } = await pool.query(
            'SELECT * FROM tblLogs WHERE path LIKE $1',
            [`%${path}%`]
        );
        return rows;
    },

    getByStatusCode: async (statusCode: number | string) => {
        const { rows } = await pool.query(
            'SELECT * FROM tblLogs WHERE status_code = $1',
            [statusCode]
        );
        return rows;
    },

    getStats: async () => {
        const { rows } = await pool.query(`
            SELECT
                COUNT(*) as total,
                COUNT(CASE WHEN level = 'error' THEN 1 END) as errors,
                COUNT(CASE WHEN level = 'warn'  THEN 1 END) as warnings,
                COUNT(CASE WHEN level = 'info'  THEN 1 END) as info,
                COUNT(CASE WHEN status_code >= 400 THEN 1 END) as failed
            FROM tblLogs
        `);
        return rows[0];
    },

    delete: async (id: string | number) => {
        const { rowCount } = await pool.query(
            'DELETE FROM tblLogs WHERE id = $1',
            [id]
        );
        return (rowCount ?? 0) > 0;
    },

    deleteByDateRange: async (startDate: string, endDate: string) => {
        const { rowCount } = await pool.query(
            'DELETE FROM tblLogs WHERE created_at BETWEEN $1 AND $2',
            [startDate, `${endDate} 23:59:59`]
        );
        return (rowCount ?? 0) > 0;
    },

    deleteAll: async () => {
        await pool.query('DELETE FROM tblLogs');
    },

    deleteOldLogs: async (days = 90) => {
        await pool.query(
            `DELETE FROM tblLogs WHERE created_at < NOW() - ($1 * INTERVAL '1 day')`,
            [days]
        );
    },

};

export default LogModel;