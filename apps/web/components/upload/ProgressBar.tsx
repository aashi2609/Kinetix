"use client";

import { useImportStore } from "@/stores/import-store";

export function ProgressBar() {
  const progress = useImportStore((s) => s.progress);
  const batchErrors = useImportStore((s) => s.batchErrors);

  const pct = progress.total > 0 ? Math.round((progress.processed / progress.total) * 100) : 0;
  const retryingCount = batchErrors.filter((e) => e.willRetry).length;

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Mapping leads to your CRM…</span>
        <span className="font-mono-data text-[var(--ink-muted)]">
          {progress.processed} / {progress.total || "…"}
        </span>
      </div>
      <div className="relative mt-4 h-2.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="animate-shimmer relative h-full overflow-hidden rounded-full bg-[var(--brand)] transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {retryingCount > 0 && (
        <p className="mt-3 text-xs text-[var(--ink-muted)]">
          Retrying {retryingCount} batch{retryingCount > 1 ? "es" : ""} that hit a transient error…
        </p>
      )}
    </div>
  );
}