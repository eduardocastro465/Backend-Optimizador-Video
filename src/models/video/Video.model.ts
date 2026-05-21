import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "@ffprobe-installer/ffprobe";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

interface CompressOptions {
  inputPath: string;
  crf: number;
  preset: string;
  codec: string;
  audioBitrate: string;
  // Nuevos parámetros opcionales
  width?: number;
  height?: number;
  framerate?: number;
}

interface CompressResult {
  filename: string;
  originalSize: number;
  compressedSize: number;
  reduction: string;
}

ffmpeg.setFfmpegPath(ffmpegPath as unknown as string);
ffmpeg.setFfprobePath(ffprobePath.path);

const HANDBRAKE_PATH = process.platform === "win32"
  ? path.join(process.cwd(), "HandBrakeCLI.exe")
  : "HandBrakeCLI";

const hbPresetMap: Record<string, string> = {
  ultrafast: "ultrafast",
  superfast: "superfast",
  veryfast: "veryfast",
  faster: "faster",
  fast: "fast",
  medium: "medium",
  slow: "slow",
  slower: "slower",
  veryslow: "veryslow",
};

export const VideoModel = {
  async compress(options: CompressOptions): Promise<CompressResult> {
    const { inputPath, crf, preset, codec, audioBitrate, width, height, framerate } = options;

    const outputDir = path.join(process.cwd(), "uploads", "compressed");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const originalSize = fs.statSync(inputPath).size;

    // ── Paso 1: FFmpeg (compresión con codec del usuario, ej. libx265) ────────
    const tempFilename = `temp_${Date.now()}.mp4`;
    const tempPath = path.join(outputDir, tempFilename);

    await new Promise<void>((resolve, reject) => {
      let cmd = ffmpeg(inputPath)
        .videoCodec(codec)              // libx264 | libx265
        .addOption("-crf", String(crf))
        .addOption("-preset", preset)
        .audioCodec("aac")
        .audioBitrate(audioBitrate);

      // Escala con aspect ratio conservado si se especificó resolución
      if (width && height) {
        // scale con letterbox / pillarbox automático
        cmd = cmd.addOption(
          "-vf",
          `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`
        );
      }

      // Baja framerate si se especificó
      if (framerate) {
        cmd = cmd.addOption("-r", String(framerate));
      }

      cmd
        .output(tempPath)
        .on("progress", (p) => console.log("ffmpeg progreso:", p.percent?.toFixed(1), "%"))
        .on("error", (err) => { console.error("ffmpeg error:", err.message); reject(err); })
        .on("end", () => { console.log("ffmpeg listo"); resolve(); })
        .run();
    });

    // ── Paso 2: HandBrake (convierte a x264 para compatibilidad universal) ────
    const filename = `compressed_${Date.now()}.mp4`;
    const outputPath = path.join(outputDir, filename);

    const hbPreset = hbPresetMap[preset] ?? "medium";
    const abNumeric = audioBitrate.replace("k", "");

    const hbArgs = [
      "-i",                tempPath,
      "-o",                outputPath,
      "--encoder",         "x264",         // siempre x264 — compatibilidad universal
      "-q",                String(crf),
      "--encoder-preset",  hbPreset,
      "--encoder-profile", "high",
      "--aencoder",        "av_aac",
      "-B",                abNumeric,
      "--crop",            "0:0:0:0",      // desactiva autocrop
      "--format",          "av_mp4",
      "--optimize",                        // faststart para streaming HTTP
    ];

    // HandBrake no necesita rescalar de nuevo — FFmpeg ya lo hizo en paso 1
    // Pero si se quiere mantener el framerate de salida del paso 1:
    if (framerate) {
      hbArgs.push("--rate", String(framerate), "--pfr");
    } else {
      hbArgs.push("--pfr"); // peak frame rate — respeta el fps original
    }

    await new Promise<void>((resolve, reject) => {
      const proc = spawn(HANDBRAKE_PATH, hbArgs);

      proc.stdout.on("data", (d: Buffer) => process.stdout.write(d));
      proc.stderr.on("data", (d: Buffer) => process.stderr.write(d));
      proc.on("close", (code: number) => {
        if (code === 0) resolve();
        else reject(new Error(`HandBrake salió con código ${code}`));
      });
      proc.on("error", reject);
    });

    // Limpia archivo temporal de FFmpeg
    fs.unlink(tempPath, () => {});

    const compressedSize = fs.statSync(outputPath).size;
    const reduction = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1) + "%";

    return { filename, originalSize, compressedSize, reduction };
  },

  deleteFile(filePath: string): void {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error al eliminar archivo:", err);
    });
  },
};