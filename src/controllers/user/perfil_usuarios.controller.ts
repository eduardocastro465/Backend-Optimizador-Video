// perfil_usuarios.controller.js
import PerfilUsuarioModel from '../../models/user/PerfilUsuario.model.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ERROR_MESSAGES } from '../../constants/errors/errorMessages.erros.js';
import { SUCCESS_MESSAGES } from '../../constants/success/successMessages.js';

export const getAllPerfiles = asyncHandler(async (_req, res) => {
    const perfiles = await PerfilUsuarioModel.getAll();
    res.status(200).json({
        success: true,
        data: perfiles
    });
});

export const getPerfilById = asyncHandler(async (req, res) => {
    const { id } = (req.params as Record<string, string>);
    const perfil = await PerfilUsuarioModel.getById(id);
    if (!perfil) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('perfil')
        });
    }
    res.status(200).json({
        success: true,
        data: perfil
    });
});

export const getPerfilByUsuarioId = asyncHandler(async (req, res) => {
    const { user_id } = (req.params as Record<string, string>);
    const perfil = await PerfilUsuarioModel.getByUserId(user_id);
    if (!perfil) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('perfil')
        });
    }
    res.status(200).json({
        success: true,
        data: perfil
    });
});

export const crearPerfil = asyncHandler(async (req, res) => {
    const { user_id } = (req.params as Record<string, string>);
    const { firstName, lastName, birthDate, phone, gender, country } = req.body;

    const existePerfil = await PerfilUsuarioModel.getByUserId(user_id);
    if (existePerfil) {
        return res.status(409).json({
            success: false,
            message: ERROR_MESSAGES.YA_EXISTE('perfil')
        });
    }

    const id = await PerfilUsuarioModel.create(user_id, { firstName, lastName, birthDate, phone, gender, country });
    res.status(201).json({
        success: true,
        message: SUCCESS_MESSAGES.PERFIL_CREADO,
        data: { id }
    });
});

export const actualizarPerfil = asyncHandler(async (req, res) => {
    const { user_id } = (req.params as Record<string, string>);
    const { firstName, lastName, birthDate, phone, gender, country } = req.body;

    const existe = await PerfilUsuarioModel.getByUserId(user_id);
    if (!existe) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('perfil')
        });
    }

    await PerfilUsuarioModel.update(user_id, { firstName, lastName, birthDate, phone, gender, country });
    res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.PERFIL_ACTUALIZADO
    });
});

export const eliminarPerfil = asyncHandler(async (req, res) => {
    const { user_id } = (req.params as Record<string, string>);

    const existe = await PerfilUsuarioModel.getByUserId(user_id);
    if (!existe) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('perfil')
        });
    }

    await PerfilUsuarioModel.delete(user_id);
    res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.PERFIL_ELIMINADO
    });
});
