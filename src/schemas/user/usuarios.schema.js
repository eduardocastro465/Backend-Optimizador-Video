import { z } from 'zod';
import { SCHEMA_ERRORS } from '../../constants/errors/errorSchemas.errors.js';

export const updateUsuarioSchema = z.object({
    username: z.string({ required_error: SCHEMA_ERRORS.USUARIO_REQUERIDO })
        .min(3, SCHEMA_ERRORS.USUARIO_MIN(3))
        .max(50, SCHEMA_ERRORS.USUARIO_MAX(50)),
    email: z.email({ required_error: SCHEMA_ERRORS.EMAIL_REQUERIDO })
        .min(5, SCHEMA_ERRORS.EMAIL_MIN(5))
        .max(100, SCHEMA_ERRORS.EMAIL_MAX(100)),
}).strict();