import RolesModel from "../../models/auth/Roles.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ERROR_MESSAGES } from '../../constants/errors/errorMessages.erros.js';
import { SUCCESS_MESSAGES } from '../../constants/success/successMessages.js';

export const getRoles = asyncHandler(async (_req, res) => {
    const roles = await RolesModel.getAll();
    return res.status(200).json({
        success: true,
        data: roles
    })
})

export const getById = asyncHandler(async (req, res) => {
    const { id } = (req.params as Record<string, string>)
    const roles = await RolesModel.getById(id);
    return res.status(200).json({
        success: true,
        data: roles
    })
})

export const createRol = asyncHandler(async (req, res) => {
    const { role, description, active } = req.body

    const roles = await RolesModel.create(role, description, active);
    return res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.ROL_CREADO,
        data: roles
    })
})

export const updateRol = asyncHandler(async (req, res) => {
    const { id } = (req.params as Record<string, string>)
    const { role, description, active } = req.body
    const roles = await RolesModel.update(id, role, description, active);
    return res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.ROL_ACTUALIZADO,
        data: roles
    })
})

export const toggleActivoRol = asyncHandler(async (req, res) => {
    const { id } = (req.params as Record<string, string>)
    const { active } = req.body
    const roleActive = await RolesModel.toggleActivo(id, active);

    if (!roleActive) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('rol')
        });
    }

    return res.status(200).json({
        success: true,
        message: active ? SUCCESS_MESSAGES.ROL_ACTIVADO : SUCCESS_MESSAGES.ROL_DESACTIVADO,
    });
})

export const deleteRol = asyncHandler(async (req, res) => {
    const { id } = (req.params as Record<string, string>)
    const eliminado = await RolesModel.delete(id);

    if (!eliminado) {
        return res.status(404).json({
            success: false,
            message: ERROR_MESSAGES.NO_ENCONTRADO('rol')
        });
    }

    res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.ROL_ELIMINADO,
    });
})
