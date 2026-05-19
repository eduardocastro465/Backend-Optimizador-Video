// Los mensajes de error en los esquemas de validación

export const SCHEMA_ERRORS = {

    // Campos obligatorios
    USUARIO_REQUERIDO: 'El nombre de usuario es obligatorio',
    EMAIL_REQUERIDO: 'El email es obligatorio',
    PASSWORD_REQUERIDO: 'La contraseña es obligatoria',
    PASSWORD_ACTUAL_REQUERIDO: 'La contraseña actual es obligatoria',
    PASSWORD_NUEVA_REQUERIDO: 'La nueva contraseña es obligatoria',
    ROL_REQUERIDO: 'El rol es obligatorio',
    NOMBRE_REQUERIDO: 'El nombre es obligatorio',
    APELLIDO_REQUERIDO: 'El apellido es obligatorio',
    TELEFONO_REQUERIDO: 'El teléfono es obligatorio',
    GENERO_REQUERIDO: 'El género es obligatorio',
    FECHA_NACIMIENTO_REQUERIDO: 'La fecha de nacimiento es obligatoria',
    PAIS_REQUERIDO: 'El país es obligatorio',
    ACTIVO_REQUERIDO: 'El campo activo es obligatorio',
    CODIGO_REQUERIDO: 'El código es obligatorio',

    // Validación — longitudes
    USUARIO_MIN: (min: number) => `El usuario debe tener al menos ${min} caracteres`,
    USUARIO_MAX: (max: number) => `El usuario no puede exceder ${max} caracteres`,
    EMAIL_MIN: (min: number) => `El email debe tener al menos ${min} caracteres`,
    EMAIL_MAX: (max: number) => `El email no puede exceder ${max} caracteres`,
    PASSWORD_MIN: (min: number) => `La contraseña debe tener al menos ${min} caracteres`,
    PASSWORD_MAX: (max: number) => `La contraseña no puede exceder ${max} caracteres`,
    NOMBRE_MIN: (min: number) => `El nombre debe tener al menos ${min} caracteres`,
    NOMBRE_MAX: (max: number) => `El nombre no puede exceder ${max} caracteres`,
    APELLIDO_MIN: (min: number) => `El apellido debe tener al menos ${min} caracteres`,
    APELLIDO_MAX: (max: number) => `El apellido no puede exceder ${max} caracteres`,
    GENERO_MIN: (min: number) => `El género debe tener al menos ${min} caracteres`,
    GENERO_MAX: (max: number) => `El género no puede exceder ${max} caracteres`,
    PAIS_MIN: (min: number) => `El país debe tener al menos ${min} caracteres`,
    PAIS_MAX: (max: number) => `El país no puede exceder ${max} caracteres`,
    ROL_MIN: (min: number) => `El rol debe tener al menos ${min} caracteres`,
    ROL_MAX: (max: number) => `El rol no puede exceder ${max} caracteres`,
    DESCRIPCION_MAX: (max: number) => `La descripción no puede exceder ${max} caracteres`,
    CODIGO_LENGTH: (n: number) => `El código de verificación debe tener exactamente ${n} dígitos`,

    // Validación — formatos
    TELEFONO_FORMATO: 'El teléfono debe tener entre 8 y 20 dígitos',
    CODIGO_SOLO_NUMEROS: 'El código solo debe contener números',
    ACTIVO_TIPO_INVALIDO: 'El campo activo debe ser verdadero o falso',
    EMAIL_O_USUARIO_REQUERIDO: 'Debe proporcionar email o usuario',
    PASSWORD_DIFERENTE: 'La nueva contraseña debe ser diferente a la actual',
    PASSWORD_MAYUSCULA: 'Debe contener al menos una mayúscula',
    PASSWORD_MINUSCULA: 'Debe contener al menos una minúscula',
    PASSWORD_NUMERO: 'Debe contener al menos un número',
    PASSWORD_SIMBOLO: 'Debe contener al menos un símbolo',

    // Validación general
    CAMPOS_REQUERIDOS: 'Todos los campos son obligatorios',
    FORMATO_EMAIL_INVALIDO: 'El formato del correo electrónico no es válido',
    CONTRASENA_MUY_CORTA: 'La contraseña debe tener al menos 8 caracteres',
}
