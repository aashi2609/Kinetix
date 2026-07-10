import type { ImportProgressEvent, ImportResult } from "@groweasy/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface StreamImportHandlers {
  onProgress: (processed: number, total: number) => void;
  onBatchError: (batchIndex: number, message: string, willRetry: boolean) => void;
  onComplete: (result: ImportResult) => void;
  onError: (message: string) => void;
}

/**
 * Streams the AI import pipeline via SSE. Uses fetch + ReadableStream rather
 * than EventSource because EventSource can't send a multipart file body.
 */
export async function streamImport(file: File, handlers: StreamImportHandlers, signal?: AbortSignal): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  console.log("🚀 Sending import request to:", `${API_URL}/api/import/process`);
  
  const res = await fetch(`${API_URL}/api/import/process`, {
    method: "POST",
    body: formData,
    signal,
  });
  
  console.log("📥 Response status:", res.status, res.ok);

  if (!res.ok || !res.body) {
    console.error("❌ Response not OK or no body:", res.status, res.statusText);
    const body = await res.json().catch(() => ({ error: "Import request failed" }));
    handlers.onError(body.error ?? `Import failed with status ${res.status}`);
    return;
  }
  
  console.log("✅ Starting to read stream...");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      console.log("🏁 Stream finished");
      break;
    }

    const chunk = decoder.decode(value, { stream: true });
    console.log("📦 Received chunk:", chunk.length, "bytes");
    buffer += chunk;
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    console.log("🔍 Found", events.length, "events in buffer");

    for (const raw of events) {
      const line = raw.trim();
      console.log("🔍 Processing line:", line.substring(0, 100));
      if (!line.startsWith("data:")) continue;

      const event = JSON.parse(line.slice(5).trim()) as ImportProgressEvent;
      console.log("📨 Event received:", event.type, event);
      switch (event.type) {
        case "progress":
          handlers.onProgress(event.processed, event.total);
          break;
        case "batch-error":
          handlers.onBatchError(event.batchIndex, event.message, event.willRetry);
          break;
        case "complete":
          handlers.onComplete(event.result);
          break;
        case "error":
          handlers.onError(event.message);
          break;
      }
    }
  }
}
