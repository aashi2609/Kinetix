import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (res.headersSent) {
    // SSE stream already started — can't send a fresh JSON error response.
    res.end();
    return;
  }

  if (err instanceof MulterError) {
    res.status(400).json({ error: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  const isKnownClientError =
    err instanceof Error &&
    /only \.csv files|no data rows|malformed csv/i.test(err.message);

  console.error("[error-handler]", err);
  res.status(isKnownClientError ? 400 : 500).json({ error: message });
}
