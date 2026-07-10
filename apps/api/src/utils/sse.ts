import type { Response } from "express";
import type { ImportProgressEvent } from "@groweasy/shared";

export function initSse(res: Response): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
}

export function sendSseEvent(res: Response, event: ImportProgressEvent): void {
  console.log("📡 Sending SSE event:", event.type);
  const data = `data: ${JSON.stringify(event)}\n\n`;
  res.write(data);
  // Force flush the buffer so the client receives it immediately
  if (typeof (res as any).flush === 'function') {
    (res as any).flush();
  }
}
