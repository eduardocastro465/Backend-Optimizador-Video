import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../constants/errors/errorMessages.erros.js";
import { z } from "zod";

// Validar los datos que vienen del cliente
export const validate =
  (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issues = JSON.parse(result.error.message);
      return res.status(400).json({
        success: false,
        message: ERROR_MESSAGES.CAMPOS_REQUERIDOS,
        errors: issues.map((e: { path: (string | number)[], message: string }) => ({
          campo: e.path[0],
          mensaje: e.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
