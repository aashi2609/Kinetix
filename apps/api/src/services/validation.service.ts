import { CrmRecordSchema, hasContactInfo, type CrmRecord, type SkippedRecord } from "@groweasy/shared";
import type { RawExtraction, RawRow } from "../providers/llm-provider.interface";

export interface ValidatedBatch {
  imported: CrmRecord[];
  skipped: SkippedRecord[];
}

const MULTI_VALUE_SPLIT = /[,;/]+|\s+(?:and|&)\s+/i;
const EMAIL_LIKE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DIGITS_ONLY = /^\+?\d{6,15}$/;

function splitMultiValue(raw: string): string[] {
  return raw
    .split(MULTI_VALUE_SPLIT)
    .map((token) => token.trim())
    .filter(Boolean);
}

function normalizeEmailField(value: unknown): { primary: unknown; extras: string[] } {
  if (typeof value !== "string" || !value.trim()) return { primary: value, extras: [] };
  const candidates = splitMultiValue(value).filter((token) => EMAIL_LIKE.test(token));
  if (candidates.length <= 1) {
    // Zero or one recognizable email — nothing to split. Pass the original
    // value through unchanged; schema validation catches genuine invalidity.
    return { primary: value, extras: [] };
  }
  return { primary: candidates[0], extras: candidates.slice(1) };
}

function normalizeMobileField(value: unknown): { primary: unknown; extras: string[] } {
  if (typeof value !== "string" || !value.trim()) return { primary: value, extras: [] };
  const candidates = splitMultiValue(value)
    .map((token) => token.replace(/[^\d+]/g, ""))
    .filter((token) => DIGITS_ONLY.test(token));
  if (candidates.length <= 1) {
    return { primary: value, extras: [] };
  }
  return { primary: candidates[0], extras: candidates.slice(1) };
}

/**
 * Code-enforced version of AI instruction rule 5 (multiple emails/mobiles):
 * the prompt already asks the model to keep only the first email/mobile and
 * move any extras into crm_note, but models don't always comply — this
 * re-derives that split directly from the field values, regardless of what
 * the model actually returned, so the rule holds even when the prompt is
 * ignored.
 */
export function normalizeMultiValueFields(candidate: RawExtraction): RawExtraction {
  const next: RawExtraction = { ...candidate };
  const extraNotes: string[] = [];

  const email = normalizeEmailField(next.email);
  if (email.extras.length > 0) {
    next.email = email.primary;
    extraNotes.push(`Additional email(s): ${email.extras.join(", ")}`);
  }

  const mobile = normalizeMobileField(next.mobile_without_country_code);
  if (mobile.extras.length > 0) {
    next.mobile_without_country_code = mobile.primary;
    extraNotes.push(`Additional mobile(s): ${mobile.extras.join(", ")}`);
  }

  if (extraNotes.length > 0) {
    const existingNote = typeof next.crm_note === "string" ? next.crm_note.trim() : "";
    next.crm_note = [existingNote, ...extraNotes].filter(Boolean).join(" | ");
  }

  return next;
}

/**
 * Code-enforced version of AI instruction rule 6 (CSV compatibility): a
 * record must remain a single CSV row if ever re-exported, so no field may
 * contain a raw line break. Any real newline is escaped to the literal
 * two-character sequence \n, exactly as the spec asks for.
 */
export function sanitizeLineBreaks(record: CrmRecord): CrmRecord {
  const sanitized = { ...record };
  (Object.keys(sanitized) as (keyof CrmRecord)[]).forEach((key) => {
    const value = sanitized[key];
    if (typeof value === "string" && /\r\n|\r|\n/.test(value)) {
      (sanitized as Record<string, unknown>)[key] = value.replace(/\r\n|\r|\n/g, "\\n");
    }
  });
  return sanitized;
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

  raw.forEach((rawCandidate, i) => {
    const sourceRow = sourceRows[i];
    const candidate = normalizeMultiValueFields(rawCandidate);
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

    imported.push(sanitizeLineBreaks(parsed.data));
  });

  return { imported, skipped };
}