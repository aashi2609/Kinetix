import { describe, it, expect, vi } from "vitest";
import { processBatches } from "../src/services/batch.service";
import { ProviderHttpError } from "../src/providers/provider-http-error";
import type { LlmProvider, RawRow } from "../src/providers/llm-provider.interface";

const HEADERS = ["Name", "Email"];
const ROWS: RawRow[] = [
  { Name: "Jane Doe", Email: "jane@example.com" },
  { Name: "John Roe", Email: "john@example.com" },
];

function validExtractionsFor(rows: RawRow[]) {
  return rows.map((row) => ({
    created_at: "2026-05-13 14:20:48",
    name: row.Name,
    email: row.Email,
  }));
}

describe("processBatches", () => {
  it("happy path: reports full progress and returns imported records with no errors", async () => {
    const provider: LlmProvider = {
      extractBatch: vi.fn().mockResolvedValue(validExtractionsFor(ROWS)),
    };
    const onProgress = vi.fn();
    const onBatchError = vi.fn();

    const outcomes = await processBatches(ROWS, HEADERS, provider, onProgress, onBatchError);

    expect(provider.extractBatch).toHaveBeenCalledTimes(1);
    expect(onBatchError).not.toHaveBeenCalled();
    expect(onProgress).toHaveBeenCalledWith(
      expect.objectContaining({ processed: ROWS.length, total: ROWS.length })
    );
    expect(outcomes).toHaveLength(1);
    expect(outcomes[0].error).toBeNull();
    expect(outcomes[0].result?.imported).toHaveLength(2);
  });

  it("retries a transient (retryable) failure and succeeds on a later attempt", async () => {
    const extractBatch = vi
      .fn()
      .mockRejectedValueOnce(new ProviderHttpError("Gemini rate limited (429)", 429, true))
      .mockResolvedValueOnce(validExtractionsFor(ROWS));
    const provider: LlmProvider = { extractBatch };
    const onBatchError = vi.fn();

    const outcomes = await processBatches(ROWS, HEADERS, provider, vi.fn(), onBatchError);

    expect(extractBatch).toHaveBeenCalledTimes(2);
    expect(onBatchError).toHaveBeenCalledTimes(1);
    expect(onBatchError).toHaveBeenCalledWith(
      expect.objectContaining({ willRetry: true })
    );
    expect(outcomes[0].error).toBeNull();
    expect(outcomes[0].result?.imported).toHaveLength(2);
  });

  it("aborts immediately on a non-retryable failure (e.g. dead/deprecated model) without exhausting retries", async () => {
    const notFound = new ProviderHttpError("Gemini model not found (404)", 404, false);
    const extractBatch = vi.fn().mockRejectedValue(notFound);
    const provider: LlmProvider = { extractBatch };
    const onBatchError = vi.fn();

    const outcomes = await processBatches(ROWS, HEADERS, provider, vi.fn(), onBatchError);

    // Exactly one attempt — retrying a 404 can never succeed, so no retries should occur.
    expect(extractBatch).toHaveBeenCalledTimes(1);
    // The UI must still be notified even though p-retry's onFailedAttempt
    // is skipped entirely for AbortError — this is the fix verified here.
    expect(onBatchError).toHaveBeenCalledTimes(1);
    expect(onBatchError).toHaveBeenCalledWith(
      expect.objectContaining({ willRetry: false, message: expect.stringContaining("404") })
    );
    expect(outcomes[0].error).toContain("404");
    expect(outcomes[0].result).toBeNull();
  });

  it("does not let one failed batch abort the rest of the import", async () => {
    const rows: RawRow[] = [{ Name: "A", Email: "a@example.com" }];
    const failingProvider: LlmProvider = {
      extractBatch: vi.fn().mockRejectedValue(new ProviderHttpError("Gemini gone (404)", 404, false)),
    };

    const outcomes = await processBatches(rows, HEADERS, failingProvider, vi.fn(), vi.fn());

    // The batch failed, but processBatches still resolves (doesn't throw),
    // proving a failure doesn't take down the whole pipeline.
    expect(outcomes).toHaveLength(1);
    expect(outcomes[0].error).not.toBeNull();
  });
});