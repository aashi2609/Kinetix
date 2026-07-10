import Papa from "papaparse";
import type { ParsedCsvPreview } from "@/stores/import-store";

export class ClientCsvError extends Error {}

const MAX_FILE_SIZE_MB = 5;

export function validateFile(file: File): void {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    throw new ClientCsvError("Only .csv files are accepted.");
  }
  if (file.size === 0) {
    throw new ClientCsvError("This file is empty.");
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new ClientCsvError(`File exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
  }
}

/** Parses a CSV file in a worker thread so large files don't block the UI. */
export function parseCsvFile(file: File): Promise<ParsedCsvPreview> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          reject(new ClientCsvError(`Row ${result.errors[0].row ?? "?"}: ${result.errors[0].message}`));
          return;
        }
        if (result.data.length === 0) {
          reject(new ClientCsvError("No data rows found in this CSV."));
          return;
        }
        resolve({ headers: result.meta.fields ?? [], rows: result.data });
      },
      error: (err) => reject(new ClientCsvError(err.message)),
    });
  });
}
