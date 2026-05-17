import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { createRolSchema, rolToggleActivoSchema, rolUpdateSchema } from '../../schemas/auth/roles.schema.js';
import { getRoles, createRol, updateRol, toggleActivoRol, deleteRol } from '../../controllers/auth/rol.controller.js';

const router = Router();

router.get('/', getRoles);
router.post('/',
    // validate(createRolSchema), 
    createRol);
router.put('/:id', validate(rolUpdateSchema), updateRol);
router.patch('/rolToggle/:id', validate(rolToggleActivoSchema), toggleActivoRol);
router.delete('/:id', deleteRol);

export default router;