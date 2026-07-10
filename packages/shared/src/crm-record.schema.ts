import { z } from "zod";
import { CRM_STATUS, DATA_SOURCE } from "./enums";

/**
 * Base shape validation only — field types, enum membership, date parseability.
 * Business rules (e.g. "must have email or mobile") are enforced separately
 * in `hasContactInfo` so we can distinguish "malformed" from "valid but skippable".
 */
export const CrmRecordSchema = z.object({
  created_at: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), {
      message: "created_at must be a valid, JS-parseable date string",
    }),
  name: z.string().trim().min(1).nullable().default(null),
  email: z.string().trim().email().nullable().default(null),
  country_code: z.string().trim().nullable().default(null),
  mobile_without_country_code: z.string().trim().nullable().default(null),
  company: z.string().trim().nullable().default(null),
  city: z.string().trim().nullable().default(null),
  state: z.string().trim().nullable().default(null),
  country: z.string().trim().nullable().default(null),
  lead_owner: z.string().trim().nullable().default(null),
  crm_status: z.enum(CRM_STATUS).nullable().default(null),
  crm_note: z.string().trim().nullable().default(null),
  data_source: z.enum(DATA_SOURCE).nullable().default(null),
  possession_time: z.string().trim().nullable().default(null),
  description: z.string().trim().nullable().default(null),
});

export type CrmRecord = z.infer<typeof CrmRecordSchema>;

/** Business rule from the spec: a record with neither email nor mobile must be skipped. */
export function hasContactInfo(record: Pick<CrmRecord, "email" | "mobile_without_country_code">): boolean {
  return Boolean(record.email) || Boolean(record.mobile_without_country_code);
}

/** The array shape the LLM must return for a batch of input rows. */
export const CrmRecordBatchSchema = z.array(CrmRecordSchema);

export interface SkippedRecord {
  row: Record<string, string>;
  reason: string;
}

export interface ImportResult {
  imported: CrmRecord[];
  skipped: SkippedRecord[];
  totalImported: number;
  totalSkipped: number;
  totalProcessed: number;
}

/** SSE event payloads streamed from POST /api/import/process */
export type ImportProgressEvent =
  | { type: "progress"; processed: number; total: number; batchIndex: number; totalBatches: number }
  | { type: "batch-error"; batchIndex: number; message: string; willRetry: boolean }
  | { type: "complete"; result: ImportResult }
  | { type: "error"; message: string };
