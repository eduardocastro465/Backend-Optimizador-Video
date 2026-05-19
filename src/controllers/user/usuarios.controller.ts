// usuarios.controller.js
import UsuarioModel from '../../models/user/Usuario.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ERROR_MESSAGES } from '../../constants/errors/errorMessages.erros.js';
import { SUCCESS_MESSAGES } from '../../constants/success/successMessages.js';

export const getUsuarios = asyncHandler(async (_req, res) => {
  const usuarios = await UsuarioModel.getAll();
  res.status(200).json({
    success: true,
    data: usuarios
  });
});

export const getUsuarioById = asyncHandler(async (req, res) => {
  const { id } = (req.params as Record<string, string>);
  const usuario = await UsuarioModel.getById(id);
  if (!usuario) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.NO_ENCONTRADO('usuario')
    });
  }
  res.status(200).json({
    success: true,
    data: usuario
  });
});

export const actualizarUsuario = asyncHandler(async (req, res) => {
  const { id } = (req.params as Record<string, string>);
  const { username, email } = req.body;

  const existe = await UsuarioModel.getById(id);
  if (!existe) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.NO_ENCONTRADO('usuario')
    });
  }

  await UsuarioModel.update(id, username, email);
  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.USUARIO_ACTUALIZADO
  });
});

export const actualizarFoto = asyncHandler(async (req, res) => {
  const { id } = (req.params as Record<string, string>);
  const { photo } = req.body;

  const existe = await UsuarioModel.getById(id);
  if (!existe) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.NO_ENCONTRADO('usuario')
    });
  }

  await UsuarioModel.updatePhoto(id, photo);
  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.FOTO_ACTUALIZADA
  });
});

export const eliminarUsuario = asyncHandler(async (req, res) => {
  const { id } = (req.params as Record<string, string>);

  const existe = await UsuarioModel.getById(id);
  if (!existe) {
    return res.status(404).json({
      success: false,
      message: ERROR_MESSAGES.NO_ENCONTRADO('usuario')
    });
  }

  await UsuarioModel.softDelete(id);
  res.status(200).json({
    success: true,
    message: SUCCESS_MESSAGES.USUARIO_ELIMINADO
  });
});
