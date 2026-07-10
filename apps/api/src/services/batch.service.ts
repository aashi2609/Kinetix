import pLimit from "p-limit";
import pRetry from "p-retry";
import { config } from "../config";
import type { LlmProvider, RawRow } from "../providers/llm-provider.interface";
import { validateExtractions, type ValidatedBatch } from "./validation.service";

export interface BatchOutcome {
  batchIndex: number;
  totalBatches: number;
  sourceRows: RawRow[];
  result: ValidatedBatch | null;
  error: string | null;
}

export type ProgressCallback = (event: {
  processed: number;
  total: number;
  batchIndex: number;
  totalBatches: number;
}) => void;

export type BatchErrorCallback = (event: {
  batchIndex: number;
  message: string;
  willRetry: boolean;
}) => void;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

/**
 * Runs all row batches through the LLM provider with bounded concurrency,
 * per-batch retry with backoff, and progress reporting. A single failed
 * batch (even after retries) does not abort the rest of the import —
 * its rows are reported back as an error batch and skipped downstream.
 */
export async function processBatches(
  rows: RawRow[],
  headers: string[],
  provider: LlmProvider,
  onProgress: ProgressCallback,
  onBatchError: BatchErrorCallback
): Promise<BatchOutcome[]> {
  const batches = chunk(rows, config.batchSize);
  const limit = pLimit(config.batchConcurrency);
  let processed = 0;

  console.log(`🔢 Processing ${rows.length} rows in ${batches.length} batches (size: ${config.batchSize}, concurrency: ${config.batchConcurrency})`);

  const tasks = batches.map((batchRows, batchIndex) =>
    limit(async (): Promise<BatchOutcome> => {
      try {
        const validated = await pRetry(
          async () => {
            const raw = await provider.extractBatch(batchRows, headers);
            return validateExtractions(raw, batchRows);
          },
          {
            retries: 2,
            onFailedAttempt: (err) => {
              console.log(`⚠️  Batch ${batchIndex} attempt failed:`, err.message, `(${err.retriesLeft} retries left)`);
              onBatchError({
                batchIndex,
                message: err.message,
                willRetry: err.retriesLeft > 0,
              });
            },
          }
        );

        processed += batchRows.length;
        onProgress({ processed, total: rows.length, batchIndex, totalBatches: batches.length });

        return { batchIndex, totalBatches: batches.length, sourceRows: batchRows, result: validated, error: null };
      } catch (err) {
        processed += batchRows.length;
        onProgress({ processed, total: rows.length, batchIndex, totalBatches: batches.length });

        const message = err instanceof Error ? err.message : "Unknown batch failure";
        return { batchIndex, totalBatches: batches.length, sourceRows: batchRows, result: null, error: message };
      }
    })
  );

  return Promise.all(tasks);
}
