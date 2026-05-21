import { Router } from "express";
import { compressVideo, downloadVideo } from "../../controllers/video/video.controller.js";
import { upload } from "../../config/multer.config.js";

const router = Router();

router.post("/compress", upload.single("video"), compressVideo);
router.get("/download/:filename", downloadVideo);

export default router;