import type { Request, Response, NextFunction } from "express";
import { initSse, sendSseEvent } from "../utils/sse";
import { runImportPipeline } from "../services/import.service";

export async function processImport(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    res.status(400).json({ error: "No CSV file provided. Attach it under the 'file' field." });
    return;
  }

  console.log("📤 Import request received:", req.file.originalname, `(${req.file.size} bytes)`);

  try {
    initSse(res);

    // Client disconnects mid-stream shouldn't leave the pipeline writing to a dead socket.
    req.on("close", () => {
      if (!res.writableEnded) res.end();
    });

    console.log("🔄 Starting import pipeline...");
    await runImportPipeline(req.file.buffer, res);
    console.log("✅ Import pipeline completed");
    res.end();
  } catch (err) {
    console.error("❌ Import pipeline error:", err);
    if (res.headersSent) {
      sendSseEvent(res, {
        type: "error",
        message: err instanceof Error ? err.message : "Unexpected server error",
      });
      res.end();
      return;
    }
    next(err);
  }
}

export function healthCheck(_req: Request, res: Response) {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
}
