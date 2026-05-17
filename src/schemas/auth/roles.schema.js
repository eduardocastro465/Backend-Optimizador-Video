import { z } from 'zod';
import { SCHEMA_ERRORS  } from '../../constants/errors/errorSchemas.errors.js';

export const createRolSchema = z.object({
    role: z.string({ required_error: SCHEMA_ERRORS.ROL_REQUERIDO })
        .min(3, SCHEMA_ERRORS.ROL_MIN(3))
        .max(30, SCHEMA_ERRORS.ROL_MAX(30)),
    description: z.string()
        .max(250, SCHEMA_ERRORS.DESCRIPCION_MAX(250))
        .optional(),
    active: z.boolean({
        invalid_type_error: SCHEMA_ERRORS.ACTIVO_TIPO_INVALIDO
    }).default(true),
}).strict();

export const rolUpdateSchema = z.object({
    role: z.string({ required_error: SCHEMA_ERRORS.ROL_REQUERIDO })
        .min(3, SCHEMA_ERRORS.ROL_MIN(3))
        .max(30, SCHEMA_ERRORS.ROL_MAX(30)),
    description: z.string()
        .max(250, SCHEMA_ERRORS.DESCRIPCION_MAX(250))
        .optional(),
    active: z.boolean({
        invalid_type_error: SCHEMA_ERRORS.ACTIVO_TIPO_INVALIDO
    }).optional(),
}).strict();

export const rolToggleActivoSchema = z.object({
    active: z.boolean({
        required_error: SCHEMA_ERRORS.ACTIVO_REQUERIDO,
        invalid_type_error: SCHEMA_ERRORS.ACTIVO_TIPO_INVALIDO
    }),
}).strict();