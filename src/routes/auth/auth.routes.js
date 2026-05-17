import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { autorizar } from '../../middlewares/auth.middleware.js';
import { ROLES_TODOS } from '../../constants/roles.js';
import { loginSchema, registerSchema, changePasswordSchema, sendEmailCodeSchema, verifyEmailCodeSchema } from '../../schemas/auth/auth.schema.js';
import { login, register, logout, changePassword, sendEmailCode, verifyEmailCode, } from '../../controllers/auth/auth.controller.js';
import { authLimiter } from '../../middlewares/rateLimit.middleware.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/register/enviarCodigoEmail', authLimiter, validate(sendEmailCodeSchema), sendEmailCode);
router.post('/register/verificarCodigoEmail', authLimiter, validate(verifyEmailCodeSchema), verifyEmailCode);
router.put('/cambiar-contrasena', verifyToken, autorizar(ROLES_TODOS), validate(changePasswordSchema), changePassword);
router.post('/logout', verifyToken, autorizar(ROLES_TODOS), logout);

export default router;