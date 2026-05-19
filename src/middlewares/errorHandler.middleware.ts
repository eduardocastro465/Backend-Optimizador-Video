// middlewares/errorHandler.middleware.js
import type { Request, Response, NextFunction } from 'express';
import { modoProduction } from "../config.js";
import { ERROR_MESSAGES } from "../constants/errors/errorMessages.erros.js";
import { logError } from '../utils/logger.js';

interface AppError extends Error {
    status?: number;
}

function getStatus(error: AppError): number {
    if (error.status) return error.status;
    if (error.name === 'JsonWebTokenError') return 401;
    if (error.message === ERROR_MESSAGES.CREDENCIALES_INCORRECTAS) return 401;
    if (error.message?.includes(ERROR_MESSAGES.USUARIO_DESACTIVADO)) return 401;
    return 500;
}

export const errorHandler = (error: AppError, req: Request, res: Response, _next: NextFunction) => {

    const status = getStatus(error);

    if (!modoProduction) {
        console.error({
            status: 'Error',
            mensaje: error.message,
            ruta: req.originalUrl,
            metodo: req.method
        });
    }

    logError(error, req);

    res.status(status).json({
        success: false,
        message: error.message || ERROR_MESSAGES.ERROR_INTERNO
    });
};

interface SyntaxErrorWithStatus extends SyntaxError {
    status?: number;
}

export const jsonErrorHandler = (err: SyntaxErrorWithStatus, _req: Request, _res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        const error = new Error(`JSON inválido: ${err.message}`) as AppError;
        error.status = 400;
        return next(error);
    }
    next(err);
};
