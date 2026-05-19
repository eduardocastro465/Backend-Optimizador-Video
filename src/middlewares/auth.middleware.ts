import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { TOKEN_SECRET } from "../config.js";
import { asyncHandler, throwError } from '../utils/asyncHandler.js';
import { ERROR_MESSAGES } from '../constants/errors/errorMessages.erros.js';
import AuthModel from '../models/auth/Auth.model.js';

// Extender el tipo Request para incluir el usuario autenticado
declare global {
    namespace Express {
        interface Request {
            user?: jwt.JwtPayload & {
                id: number;
                username: string;
                email: string;
                role_id: number;
                active: boolean;
            };
        }
    }
}

export const verifyToken = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || req.cookies?.token;

    if (!token) {
        throwError(ERROR_MESSAGES.NO_ENCONTRADO('token'), 401);
    }

    const decodedToken = jwt.verify(token, TOKEN_SECRET) as jwt.JwtPayload & {
        id: number; username: string; email: string; role_id: number; active: boolean;
    };
    req.user = decodedToken;

    if (!decodedToken.active) {
        throwError(ERROR_MESSAGES.USUARIO_DESACTIVADO, 401);
    }

    next();
});

export const autorizar = (...rolesPermitidos: number[]) => {
    return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {

        if (!req.user?.role_id) {
            throwError(ERROR_MESSAGES.SIN_ROL, 401);
        }

        const rol = await AuthModel.checkPermissions(req.user!.role_id);

        if (!rolesPermitidos.includes(rol.id)) {
            throwError(ERROR_MESSAGES.SIN_PERMISO, 403);
        }

        next();
    });
};
