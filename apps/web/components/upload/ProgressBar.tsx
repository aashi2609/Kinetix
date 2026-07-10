"use client";

import { useImportStore } from "@/stores/import-store";

export function ProgressBar() {
  const progress = useImportStore((s) => s.progress);
  const batchErrors = useImportStore((s) => s.batchErrors);

  const pct = progress.total > 0 ? Math.round((progress.processed / progress.total) * 100) : 0;
  const retryingCount = batchErrors.filter((e) => e.willRetry).length;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Mapping leads to your CRM…</span>
        <span className="font-mono-data text-[var(--ink-muted)]">
          {progress.processed} / {progress.total || "…"}
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {retryingCount > 0 && (
        <p className="mt-2 text-xs text-[var(--ink-muted)]">
          Retrying {retryingCount} batch{retryingCount > 1 ? "es" : ""} that hit a transient error…
        </p>
      )}
    </div>
  );
}
