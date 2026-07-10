import type { Response } from "express";
import type { ImportProgressEvent } from "@groweasy/shared";

export function initSse(res: Response): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();
}

export function sendSseEvent(res: Response, event: ImportProgressEvent): void {
  if (res.writableEnded) {
    console.warn("⚠️  Attempted to write to ended stream:", event.type);
    return;
  }
  console.log("📡 Sending SSE event:", event.type);
  const data = `data: ${JSON.stringify(event)}\n\n`;
  res.write(data);
}

export function sendSseEventSync(res: Response, event: ImportProgressEvent): void {
  if (res.writableEnded) {
    console.warn("⚠️  Attempted to write to ended stream:", event.type);
    return;
  }
  console.log("📡 Sending SSE event (sync):", event.type);
  const data = `data: ${JSON.stringify(event)}\n\n`;
  res.write(data);
  // Force immediate send - no buffering
  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }
}
