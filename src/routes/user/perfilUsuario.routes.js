// perfil_usuarios.routes.js
import { Router } from 'express';
import {
    getAllPerfiles,
    getPerfilById,
    getPerfilByUsuarioId,
    crearPerfil,
    actualizarPerfil,
    eliminarPerfil
} from '../../controllers/user/perfil_usuarios.controller.js';

const router = Router();

// Rutas para obtener perfiles
router.get('/:user_id', getPerfilByUsuarioId);
router.get('/:id', getPerfilById);
router.get('/', getAllPerfiles);

// Rutas para crear, actualizar y eliminar perfiles
router.post('/:user_id', crearPerfil);
router.put('/:user_id', actualizarPerfil);
router.delete('/:user_id', eliminarPerfil);

export default router;