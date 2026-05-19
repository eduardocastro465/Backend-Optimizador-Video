// Mis mensajes de éxito
// Aqui van los mensajes de éxito que se usan en toda la aplicacion

export const SUCCESS_MESSAGES = {
  // Auth
  LOGIN_EXITOSO: "Inicio de sesión exitoso",
  LOGOUT_EXITOSO: "Cierre de sesión exitoso",
  REGISTRO_EXITOSO: "Usuario registrado exitosamente",
  CONTRASENA_CAMBIADA: "Contraseña cambiada exitosamente",

  // Correo
  Codigo_Enviado: "Código enviado a tu correo correctamente",
  Codigo_Verificado: "Codigo verificado correctamente",

  // Usuarios
  USUARIO_ACTUALIZADO: "Usuario actualizado exitosamente",
  FOTO_ACTUALIZADA: "Foto actualizada exitosamente",
  USUARIO_ELIMINADO: "Usuario eliminado exitosamente",
  USUARIO_DESACTIVADO: "Tu Usuario ha sido desactivado",
  USUARIO_CREADO: "Usuario creado exitosamente",

  // Perfiles
  PERFIL_CREADO: "Perfil creado exitosamente",
  PERFIL_ACTUALIZADO: "Perfil actualizado exitosamente",
  PERFIL_ELIMINADO: "Perfil eliminado exitosamente",

  // Roles
  ROL_CREADO: "Rol creado exitosamente",
  ROL_ACTUALIZADO: "Rol actualizado exitosamente",
  ROL_ELIMINADO: "Rol eliminado exitosamente",
  ROL_ASIGNADO: "Rol asignado exitosamente",
  ROL_ACTIVADO: "Rol activado exitosamente",
  ROL_DESACTIVADO: "Rol desactivado exitosamente",

  // Logs
  LOG_ELIMINADO: "Log eliminado exitosamente",
  LOGS_ELIMINADOS: "Logs eliminados exitosamente",

  // Dinámicos
  CREADO: (campo: string) => `${campo} creado exitosamente`,
  ACTUALIZADO: (campo: string) => `${campo} actualizado exitosamente`,
  ELIMINADO: (campo: string) => `${campo} eliminado exitosamente`,
};
