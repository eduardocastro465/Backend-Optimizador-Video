import { Request, Response, NextFunction } from "express";
import sanitize from 'sanitize-html';

const sanitizarValor = (valor: unknown): unknown => {
    if (typeof valor === 'string') {
        return sanitize(valor, { allowedTags: [] }).trim();
    }
    if (typeof valor === 'object' && valor !== null) {
        return sanitizarBody(valor as Record<string, unknown>); // recursivo para objetos anidados
    }
    return valor;
};

const sanitizarBody = (obj: Record<string, unknown>): Record<string, unknown> => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, sanitizarValor(value)])
    );
};

export const sanitizeHtml = (req: Request, _res: Response, next: NextFunction) => {
    if (req.body) {
        req.body = sanitizarBody(req.body);
    }
    next();
};
