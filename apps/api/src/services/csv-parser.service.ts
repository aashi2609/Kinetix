import { parse } from "csv-parse/sync";
import type { RawRow } from "../providers/llm-provider.interface";

export interface ParsedCsv {
  headers: string[];
  rows: RawRow[];
}

export class CsvParseError extends Error {}

/**
 * Parses a CSV buffer into header-keyed row objects.
 * Does not assume any fixed column names — headers are whatever the file contains.
 */
export function parseCsvBuffer(buffer: Buffer): ParsedCsv {
  let records: RawRow[];
  try {
    records = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    }) as RawRow[];
  } catch (err) {
    throw new CsvParseError(
      err instanceof Error ? `Malformed CSV: ${err.message}` : "Malformed CSV"
    );
  }

  if (records.length === 0) {
    throw new CsvParseError("CSV file contains no data rows");
  }

  const headers = Object.keys(records[0]);
  return { headers, rows: records };
}
