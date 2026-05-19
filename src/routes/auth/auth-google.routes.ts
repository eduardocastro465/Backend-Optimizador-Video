import { Router } from "express";
import { verifyGoogleAuth } from "../../services/googleAuth.service.js";

const router = Router();

router.post("/verify", verifyGoogleAuth);

export default router;
