import type { Response } from "express";
import type { CrmRecord, ImportResult, SkippedRecord } from "@groweasy/shared";
import { config } from "../config";
import { parseCsvBuffer, CsvParseError } from "./csv-parser.service";
import { processBatches } from "./batch.service";
import { getLlmProvider } from "../providers/provider.factory";
import { sendSseEvent } from "../utils/sse";

export class ImportValidationError extends Error {}

/**
 * Runs the full CSV -> AI extraction -> validated result pipeline,
 * streaming progress events to the client as SSE as batches complete.
 */
export async function runImportPipeline(buffer: Buffer, res: Response): Promise<void> {
  let headers: string[];
  let rows: ReturnType<typeof parseCsvBuffer>["rows"];

  try {
    const parsed = parseCsvBuffer(buffer);
    headers = parsed.headers;
    rows = parsed.rows;
  } catch (err) {
    const message = err instanceof CsvParseError ? err.message : "Failed to parse CSV";
    sendSseEvent(res, { type: "error", message });
    return;
  }

  if (rows.length > config.maxRows) {
    sendSseEvent(res, {
      type: "error",
      message: `File has ${rows.length} rows, which exceeds the ${config.maxRows}-row limit for a single import`,
    });
    return;
  }

  const provider = getLlmProvider();

  const outcomes = await processBatches(
    rows,
    headers,
    provider,
    (progress) => sendSseEvent(res, { type: "progress", ...progress }),
    (batchError) => sendSseEvent(res, { type: "batch-error", ...batchError })
  );

  const imported: CrmRecord[] = [];
  const skipped: SkippedRecord[] = [];

  for (const outcome of outcomes) {
    if (outcome.result) {
      imported.push(...outcome.result.imported);
      skipped.push(...outcome.result.skipped);
    } else {
      // Batch failed all retries — report every row in it as skipped with the failure reason.
      for (const row of outcome.sourceRows) {
        skipped.push({ row, reason: `AI extraction failed: ${outcome.error ?? "unknown error"}` });
      }
    }
  }

  const result: ImportResult = {
    imported,
    skipped,
    totalImported: imported.length,
    totalSkipped: skipped.length,
    totalProcessed: rows.length,
  };

  sendSseEvent(res, { type: "complete", result });
  
  // Give the client time to receive the final event before closing
  await new Promise(resolve => setTimeout(resolve, 100));
}
