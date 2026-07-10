import { CrmRecordSchema, hasContactInfo, type CrmRecord, type SkippedRecord } from "@groweasy/shared";
import type { RawExtraction, RawRow } from "../providers/llm-provider.interface";

export interface ValidatedBatch {
  imported: CrmRecord[];
  skipped: SkippedRecord[];
}

/**
 * The critical defense-in-depth step: every record the LLM claims to have
 * extracted is re-validated here against the shared Zod schema AND the
 * email-or-mobile business rule, regardless of what the prompt asked for.
 * The model is never trusted as the final authority on data shape or rules.
 */
export function validateExtractions(raw: RawExtraction[], sourceRows: RawRow[]): ValidatedBatch {
  const imported: CrmRecord[] = [];
  const skipped: SkippedRecord[] = [];

  if (raw.length !== sourceRows.length) {
    // Model returned a mismatched count — we cannot safely zip results to rows.
    // Fail the whole batch loudly rather than silently misassigning data.
    throw new Error(
      `Extraction count mismatch: expected ${sourceRows.length} records, got ${raw.length}`
    );
  }

  raw.forEach((candidate, i) => {
    const sourceRow = sourceRows[i];
    const parsed = CrmRecordSchema.safeParse(candidate);

    if (!parsed.success) {
      skipped.push({
        row: sourceRow,
        reason: `Schema validation failed: ${parsed.error.issues[0]?.message ?? "invalid shape"}`,
      });
      return;
    }

    if (!hasContactInfo(parsed.data)) {
      skipped.push({
        row: sourceRow,
        reason: "No email or mobile number present — required for import",
      });
      return;
    }

    imported.push(parsed.data);
  });

  return { imported, skipped };
}
