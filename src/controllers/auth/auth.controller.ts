import AuthModel from "../../models/auth/Auth.model.js";
import { asyncHandler, throwError } from "../../utils/asyncHandler.js";
import { ERROR_MESSAGES } from "../../constants/errors/errorMessages.erros.js";
import { SUCCESS_MESSAGES } from "../../constants/success/successMessages.js";
import { modoProduction } from "../../config.js";
import { generarCodigo, sendEmail } from "../../services/email.service.js";
import { LoginBody, RegisterBody } from "../../schemas/auth/auth.schema.js";

export const verifyPermissions = asyncHandler(async (req, res) => {
  const roleId = req.user?.role_id;

  if (!roleId) {
    return throwError(ERROR_MESSAGES.SIN_ROL, 401);
  }
  const role = await AuthModel.checkPermissions(roleId);
  res.status(200).json({
    success: true,
    data: role,
  });
});

export const sendEmailCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // const emailTaken = await AuthModel.emailExists(email);

  // if (emailTaken) {
  //   return throwError(ERROR_MESSAGES.YA_EXISTE(`correo ${email}`), 400);
  // }

  const code = generarCodigo();

  await AuthModel.saveEmailCode(email, code);

  await sendEmail(email, code);

  return res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.Codigo_Enviado,
  });
});

export const verifyEmailCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const verifiedCode = await AuthModel.verifyEmailCode(email, code);

  if (!verifiedCode) throwError(ERROR_MESSAGES.CODIGO_INVALIDO, 400);

  await AuthModel.markCodeAsUsed(verifiedCode.id);

  return res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.Codigo_Verificado,
  });
});

export const validateUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username) {
    res.status(400).json({
      success: false,
      message: ERROR_MESSAGES.USERNAME_YA_REGISTRADO(username),
    });
    return;
  }

  const taken = await AuthModel.usernameExists(username);

  res.status(200).json({
    success: true,
    available: !taken,
  });
});

export const register = asyncHandler(async (req, res) => {
  const { user, perfilUser } = req.body as RegisterBody;

  const { token } = await AuthModel.register(user, perfilUser);

  res.cookie("token", token, {
    httpOnly: true,
    secure: modoProduction,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  });
  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.REGISTRO_EXITOSO,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, email, username, password } = req.body as LoginBody;

  let userEmail = email;
  let userName = username;

  if (identifier) {
    if (identifier.includes("@")) {
      userEmail = identifier;
    } else {
      userName = identifier;
    }
  }

  const { token, user } = await AuthModel.login(userEmail, userName, password);

  res.cookie("token", token, {
    httpOnly: true,
    secure: modoProduction,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  });

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.LOGIN_EXITOSO,
    user,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { email, username, password, newPassword } = req.body;

  await AuthModel.changePassword(email, username, password, newPassword);
  res.status(201).json({
    success: true,
    message: SUCCESS_MESSAGES.CONTRASENA_CAMBIADA,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: ERROR_MESSAGES.TOKEN_NO_PROPORCIONADO,
    });
  }

  res.cookie("token", "", {
    httpOnly: true,
    secure: modoProduction,
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.LOGOUT_EXITOSO,
  });
});
