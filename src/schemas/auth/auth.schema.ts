import { z } from "zod";
import { SCHEMA_ERRORS } from "../../constants/errors/errorSchemas.errors.js";

const passwordSchema = z
  .string({ error: SCHEMA_ERRORS.PASSWORD_REQUERIDO })
  .min(8, SCHEMA_ERRORS.PASSWORD_MIN(8))
  .max(50, SCHEMA_ERRORS.PASSWORD_MAX(50))
  .regex(/[A-Z]/, SCHEMA_ERRORS.PASSWORD_MAYUSCULA)
  .regex(/[a-z]/, SCHEMA_ERRORS.PASSWORD_MINUSCULA)
  .regex(/[0-9]/, SCHEMA_ERRORS.PASSWORD_NUMERO)
  .regex(/[^A-Za-z0-9]/, SCHEMA_ERRORS.PASSWORD_SIMBOLO);

const emailSchema = z
  .email({ error: SCHEMA_ERRORS.EMAIL_REQUERIDO })
  .min(5, SCHEMA_ERRORS.EMAIL_MIN(5))
  .max(100, SCHEMA_ERRORS.EMAIL_MAX(100));

export const registerSchema = z
  .object({
    user: z.object({
      username: z
        .string({ error: SCHEMA_ERRORS.USUARIO_REQUERIDO })
        .min(3, SCHEMA_ERRORS.USUARIO_MIN(3))
        .max(30, SCHEMA_ERRORS.USUARIO_MAX(30)),
      email: emailSchema,
      password: passwordSchema,
    }),
    perfilUser: z
      .object({
        firstName: z
          .string({ error: SCHEMA_ERRORS.NOMBRE_REQUERIDO })
          .min(3, SCHEMA_ERRORS.NOMBRE_MIN(3))
          .max(30, SCHEMA_ERRORS.NOMBRE_MAX(30)),
        lastName: z
          .string({ error: SCHEMA_ERRORS.APELLIDO_REQUERIDO })
          .min(3, SCHEMA_ERRORS.APELLIDO_MIN(3))
          .max(50, SCHEMA_ERRORS.APELLIDO_MAX(50)),
        phone: z
          .string({ error: SCHEMA_ERRORS.TELEFONO_REQUERIDO })
          .regex(/^[0-9]{8,20}$/, SCHEMA_ERRORS.TELEFONO_FORMATO)
          .optional(),
        birthDate: z.coerce.date({
          error: SCHEMA_ERRORS.FECHA_NACIMIENTO_REQUERIDO,
        }),
        gender: z
          .string({ error: SCHEMA_ERRORS.GENERO_REQUERIDO })
          .optional(),

        country: z
          .string({ error: SCHEMA_ERRORS.PAIS_REQUERIDO })
          .min(3, SCHEMA_ERRORS.PAIS_MIN(3))
          .max(60, SCHEMA_ERRORS.PAIS_MAX(60))
          .optional(),
      })
      .optional(),
  })
  .strict();

export const loginSchema = z
  .object({
    identifier: z
      .string()
      .min(3, SCHEMA_ERRORS.USUARIO_MIN(3))
      .max(100)
      .optional(),
    email: emailSchema.optional(),
    username: z
      .string()
      .min(3, SCHEMA_ERRORS.USUARIO_MIN(3))
      .max(30, SCHEMA_ERRORS.USUARIO_MAX(30))
      .optional(),
    password: passwordSchema,
  })
  .refine((data) => data.identifier || data.email || data.username, {
    message: SCHEMA_ERRORS.EMAIL_O_USUARIO_REQUERIDO,
    path: ["email"],
  });

export const changePasswordSchema = z
  .object({
    email: emailSchema.optional(),

    username: z
      .string()
      .min(3, SCHEMA_ERRORS.USUARIO_MIN(3))
      .max(30, SCHEMA_ERRORS.USUARIO_MAX(30))
      .optional(),

    password: z
      .string({ error: SCHEMA_ERRORS.PASSWORD_ACTUAL_REQUERIDO })
      .min(8, SCHEMA_ERRORS.PASSWORD_MIN(8))
      .max(50, SCHEMA_ERRORS.PASSWORD_MAX(50)),

    newPassword: z
      .string({ error: SCHEMA_ERRORS.PASSWORD_NUEVA_REQUERIDO })
      .min(8, SCHEMA_ERRORS.PASSWORD_MIN(8))
      .max(50, SCHEMA_ERRORS.PASSWORD_MAX(50))
      .regex(/[A-Z]/, SCHEMA_ERRORS.PASSWORD_MAYUSCULA)
      .regex(/[a-z]/, SCHEMA_ERRORS.PASSWORD_MINUSCULA)
      .regex(/[0-9]/, SCHEMA_ERRORS.PASSWORD_NUMERO)
      .regex(/[^A-Za-z0-9]/, SCHEMA_ERRORS.PASSWORD_SIMBOLO),
  })
  .refine((data) => data.email || data.username, {
    message: SCHEMA_ERRORS.EMAIL_O_USUARIO_REQUERIDO,
    path: ["email"],
  })
  .refine((data) => data.password !== data.newPassword, {
    message: SCHEMA_ERRORS.PASSWORD_DIFERENTE,
    path: ["newPassword"],
  });

export const sendEmailCodeSchema = z.object({
  email: emailSchema,
});

export const verifyEmailCodeSchema = z.object({
  email: emailSchema,
  code: z
    .string({ error: SCHEMA_ERRORS.CODIGO_REQUERIDO })
    .length(6, SCHEMA_ERRORS.CODIGO_LENGTH(6))
    .regex(/^[0-9]+$/, SCHEMA_ERRORS.CODIGO_SOLO_NUMEROS),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;
