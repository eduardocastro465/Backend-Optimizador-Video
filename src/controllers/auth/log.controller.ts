import cron from 'node-cron';
import LogModel from "../../models/auth/Log.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ERROR_MESSAGES } from '../../constants/errors/errorMessages.erros.js';
import { SUCCESS_MESSAGES } from '../../constants/success/successMessages.js';

// Elimina logs con más de 90 días de antigüedad cada día a las 3:00 AM
cron.schedule('0 3 * * *', async () => {
    await LogModel.deleteOldLogs(90);
});

export const getLogs = asyncHandler(async (req, res) => {
    const { limit = 100, page = 1 } = (req.query as Record<string, string>);
    const limitNum = Number(limit);
    const pageNum = Number(page);
    const offset = (pageNum - 1) * limitNum;
    const logs = await LogModel.getAll(limitNum, offset);
    return res.status(200).json({ success: true, data: logs });
});

export const getLogsByUserId = asyncHandler(async (req, res) => {
    const { id } = (req.params as Record<string, string>)
    const logs = await LogModel.getByUserId(id);
    return res.status(200).json({
        success: true,
        data: logs
    })
})

export const getLogsByDate = asyncHandler(async (req, res) => {
    const { date } = (req.params as Record<string, string>)
    const logs = await LogModel.getByDate(date);
    return res.status(200).json({
        success: true,
        data: logs
    })
})



export const getLogById = asyncHandler(async (req, res) => {
    const { id } = (req.params as Record<string, string>)
    const log = await LogModel.getById(id);
    return res.status(200).json({
        success: true,
        data: log
    })
})

export const getLogsByLevel = asyncHandler(async (req, res) => {
    const { level } = (req.params as Record<string, string>);
    const logs = await LogModel.getByLevel(level);
    return res.status(200).json({ success: true, data: logs });
});

export const getLogsByPath = asyncHandler(async (req, res) => {
    const { path } = (req.query as Record<string, string>);
    const logs = await LogModel.getByPath(path);
    return res.status(200).json({ success: true, data: logs });
});

export const getLogsByDateRange = asyncHandler(async (req, res) => {
    const { startDate, endDate } = (req.query as Record<string, string>);
    const logs = await LogModel.getByDateRange(startDate, endDate);
    return res.status(200).json({ success: true, data: logs });
});

export const getLogsByStatusCode = asyncHandler(async (req, res) => {
    const { status } = (req.params as Record<string, string>);
    const logs = await LogModel.getByStatusCode(status);
    return res.status(200).json({ success: true, data: logs });
});

export const getLogsStats = asyncHandler(async (_req, res) => {
    const stats = await LogModel.getStats();
    return res.status(200).json({ success: true, data: stats });
});

export const deleteLogsByDateRange = asyncHandler(async (req, res) => {
    const { startDate, endDate } = (req.query as Record<string, string>);
    const eliminados = await LogModel.deleteByDateRange(startDate, endDate);

    if (!eliminados) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('logs en ese rango')
        });
    }

    return res.status(200).json({
        success: true,
        message: `Logs eliminados correctamente`
    });
});

export const deleteAllLogs = asyncHandler(async (_req, res) => {
    await LogModel.deleteAll();
    return res.status(200).json({
        success: true,
        message: 'Todos los logs han sido eliminados'
    });
});

export const deleteLog = asyncHandler(async (req, res) => {
    const { id } = (req.params as Record<string, string>)
    const eliminado = await LogModel.delete(id);

    if (!eliminado) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('log')
        });
    }

    res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.ROL_ELIMINADO,
    });
})
