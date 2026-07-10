"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useImportStore } from "@/stores/import-store";
import { validateFile, parseCsvFile, ClientCsvError } from "@/lib/csv-client";

export function useCsvUpload() {
  const setFile = useImportStore((s) => s.setFile);
  const setPreview = useImportStore((s) => s.setPreview);

  const handleFile = useCallback(
    async (file: File) => {
      try {
        validateFile(file);
        setFile(file);
        const preview = await parseCsvFile(file);
        setPreview(preview);
      } catch (err) {
        const message = err instanceof ClientCsvError ? err.message : "Could not read this file.";
        toast.error(message);
      }
    },
    [setFile, setPreview]
  );

  return { handleFile };
}
