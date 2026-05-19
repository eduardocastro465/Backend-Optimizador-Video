import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler = (funcion: AsyncFn): RequestHandler => (req, res, next) => {
    Promise.resolve(funcion(req, res, next)).catch(next);
};

export const throwError = (message: string, status: number): never => {
    const error = new Error(message) as Error & { status: number };
    error.status = status;
    throw error;
};
