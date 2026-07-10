import multer from "multer";
import { config } from "../config";

const ALLOWED_MIME_TYPES = new Set([
  "text/csv",
  "application/vnd.ms-excel",
  "application/csv",
  "text/plain",
]);

export const csvUpload = multer({
  // Memory storage only — we never write untrusted uploads to disk.
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxUploadSizeMb * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const isCsvExtension = file.originalname.toLowerCase().endsWith(".csv");
    const isCsvMime = ALLOWED_MIME_TYPES.has(file.mimetype);

    if (!isCsvExtension || !isCsvMime) {
      cb(new Error("Only .csv files are accepted"));
      return;
    }
    cb(null, true);
  },
});
