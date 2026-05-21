import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { VideoModel } from "../../models/video/Video.model.js";
import path from "path";
import fs from "fs";

export const compressVideo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: "No se recibió ningún video" });
    return;
  }

  const crf = Number(req.body.crf) || 28;
  const preset = req.body.preset || "medium";
  const codec = req.body.codec || "libx265";
  const audioBitrate = req.body.audioBitrate || "128k";

  // Nuevos parámetros opcionales
  const width = req.body.width ? Number(req.body.width) : undefined;
  const height = req.body.height ? Number(req.body.height) : undefined;
  const framerate = req.body.framerate ? Number(req.body.framerate) : undefined;

  const result = await VideoModel.compress({
    inputPath: req.file.path,
    crf,
    preset,
    codec,
    audioBitrate,
    width,
    height,
    framerate,
  });

  res.json({
    success: true,
    data: {
      ...result,
      downloadUrl: `/api/videos/download/${result.filename}`,
    },
  });
});

export const downloadVideo = asyncHandler(async (req: Request, res: Response) => {
  const filename = req.params.filename as string;
  const filePath = path.join(process.cwd(), "uploads", "compressed", filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ success: false, message: "Archivo no encontrado" });
    return;
  }

  const stat = fs.statSync(filePath);
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Length", stat.size);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});