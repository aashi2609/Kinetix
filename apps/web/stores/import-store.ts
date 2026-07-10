import { create } from "zustand";
import type { CrmRecord, SkippedRecord } from "@groweasy/shared";

export type ImportStatus =
  | "idle"
  | "previewing"
  | "processing"
  | "done"
  | "error";

export interface ParsedCsvPreview {
  headers: string[];
  rows: Record<string, string>[];
}

interface BatchErrorEntry {
  batchIndex: number;
  message: string;
  willRetry: boolean;
}

interface ImportState {
  file: File | null;
  preview: ParsedCsvPreview | null;
  status: ImportStatus;
  progress: { processed: number; total: number };
  batchErrors: BatchErrorEntry[];
  results: { imported: CrmRecord[]; skipped: SkippedRecord[] } | null;
  errorMessage: string | null;

  setFile: (file: File) => void;
  setPreview: (preview: ParsedCsvPreview) => void;
  startProcessing: () => void;
  updateProgress: (processed: number, total: number) => void;
  addBatchError: (entry: BatchErrorEntry) => void;
  complete: (results: { imported: CrmRecord[]; skipped: SkippedRecord[] }) => void;
  fail: (message: string) => void;
  reset: () => void;
}

export const useImportStore = create<ImportState>((set) => ({
  file: null,
  preview: null,
  status: "idle",
  progress: { processed: 0, total: 0 },
  batchErrors: [],
  results: null,
  errorMessage: null,

  setFile: (file) => set({ file, status: "idle" }),
  setPreview: (preview) => set({ preview, status: "previewing" }),
  startProcessing: () =>
    set({ status: "processing", progress: { processed: 0, total: 0 }, batchErrors: [], errorMessage: null }),
  updateProgress: (processed, total) => set({ progress: { processed, total } }),
  addBatchError: (entry) => set((s) => ({ batchErrors: [...s.batchErrors, entry] })),
  complete: (results) => set({ status: "done", results }),
  fail: (message) => set({ status: "error", errorMessage: message }),
  reset: () =>
    set({
      file: null,
      preview: null,
      status: "idle",
      progress: { processed: 0, total: 0 },
      batchErrors: [],
      results: null,
      errorMessage: null,
    }),
}));
