import { Router } from "express";
import { csvUpload } from "../middleware/upload.middleware";
import { importRateLimit } from "../middleware/rate-limit.middleware";
import { processImport, healthCheck } from "../controllers/import.controller";

export const importRouter = Router();

importRouter.get("/health", healthCheck);

// SSE streaming endpoint: parses CSV, runs AI extraction batches, streams progress.
importRouter.post("/import/process", importRateLimit, csvUpload.single("file"), processImport);
