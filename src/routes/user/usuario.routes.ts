// usuarios.routes.js
import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { autorizar } from "../../middlewares/auth.middleware.js";
import { ROLES_ADMIN, ROLES_TODOS } from "../../constants/roles.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateUsuarioSchema } from "../../schemas/user/usuarios.schema.js";
import {
  getUsuarios,
  getUsuarioById,
  actualizarUsuario,
  actualizarFoto,
  eliminarUsuario,
} from "../../controllers/user/usuarios.controller.js";

const router = Router();

// Rutas protegidas (requieren autenticación)
router.get("/", verifyToken, autorizar(...ROLES_ADMIN), getUsuarios);
router.get("/:id", verifyToken, autorizar(...ROLES_TODOS), getUsuarioById);
router.put(
  "/:id",
  verifyToken,
  autorizar(...ROLES_TODOS),
  validate(updateUsuarioSchema),
  actualizarUsuario,
);
router.patch(
  "/:id/foto",
  verifyToken,
  autorizar(...ROLES_TODOS),
  actualizarFoto,
);
router.delete("/:id", verifyToken, autorizar(...ROLES_TODOS), eliminarUsuario);

export default router;
