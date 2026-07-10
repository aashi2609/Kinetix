export type RawRow = Record<string, string>;

/**
 * A raw, not-yet-validated extraction result from the LLM for one input row.
 * Kept as `unknown`-ish (loosely typed record) on purpose — the caller is
 * responsible for running this through CrmRecordSchema before trusting it.
 * Never assume the model followed the schema perfectly.
 */
export type RawExtraction = Record<string, unknown>;

export interface LlmProvider {
  /**
   * Extract CRM fields for a batch of raw CSV rows.
   * MUST return exactly one result per input row, in the same order,
   * so the caller can zip results back to their source rows.
   */
  extractBatch(rows: RawRow[], headers: string[]): Promise<RawExtraction[]>;
}
