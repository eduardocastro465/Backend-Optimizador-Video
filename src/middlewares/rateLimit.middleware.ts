import rateLimit, { Options } from "express-rate-limit";
import { ERROR_MESSAGES } from "../constants/errors/errorMessages.erros.js";

const baseConfig: Partial<Options> = {
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_, res, __, options) => {
    // 429 Too Many Requests
    res.status(429).json({
      success: false,
      retryAfter: Math.ceil(options.windowMs / 1000 / 60), // 60 minutos
    });
  },
};

export const generalLimiter = rateLimit({
  ...baseConfig,
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { success: false, message: ERROR_MESSAGES.DEMASIADAS_PETICIONES },
});

export const authLimiter = rateLimit({
  ...baseConfig,
  windowMs: 60 * 60 * 1000, // 1h
  max: 20,
  message: { success: false, message: ERROR_MESSAGES.DEMASIADOS_INTENTOS_AUTH },
  skipSuccessfulRequests: true, // solo cuenta intentos fallidos
});
