"use client";

import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { useImportStore } from "@/stores/import-store";
import { streamImport } from "@/lib/api-client";

export function useImportStream() {
  const file = useImportStore((s) => s.file);
  const startProcessing = useImportStore((s) => s.startProcessing);
  const updateProgress = useImportStore((s) => s.updateProgress);
  const addBatchError = useImportStore((s) => s.addBatchError);
  const complete = useImportStore((s) => s.complete);
  const fail = useImportStore((s) => s.fail);

  const controllerRef = useRef<AbortController | null>(null);

  const confirmImport = useCallback(async () => {
    if (!file) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    startProcessing();

    try {
      await streamImport(
        file,
        {
          onProgress: updateProgress,
          onBatchError: (batchIndex, message, willRetry) => {
            addBatchError({ batchIndex, message, willRetry });
            if (!willRetry) {
              toast.warning(`Batch ${batchIndex + 1} failed after retries — its rows were skipped.`);
            }
          },
          onComplete: complete,
          onError: (message) => {
            fail(message);
            toast.error(message);
          },
        },
        controller.signal
      );
    } catch (err) {
      if (controller.signal.aborted) return;
      const message = err instanceof Error ? err.message : "Import failed unexpectedly.";
      fail(message);
      toast.error(message);
    }
  }, [file, startProcessing, updateProgress, addBatchError, complete, fail]);

  const cancelImport = useCallback(() => {
    controllerRef.current?.abort();
  }, []);

  return { confirmImport, cancelImport };
}
