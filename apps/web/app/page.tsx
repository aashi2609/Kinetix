"use client";

import { useImportStore } from "@/stores/import-store";
import { useImportStream } from "@/lib/hooks/useImportStream";
import { Dropzone } from "@/components/upload/Dropzone";
import { ProgressBar } from "@/components/upload/ProgressBar";
import { VirtualizedTable } from "@/components/table/VirtualizedTable";
import { ResultsView } from "@/components/table/ResultsView";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function HomePage() {
  const { file, preview, status, errorMessage } = useImportStore();
  const reset = useImportStore((s) => s.reset);
  const { confirmImport, cancelImport } = useImportStream();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">GrowEasy</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">AI Lead Importer</h1>
          <p className="mt-1 max-w-lg text-sm text-[var(--ink-muted)]">
            Upload any lead CSV — Facebook, Google Ads, or a manual spreadsheet. AI maps it to
            your CRM format automatically, however the columns are named.
          </p>
        </div>
        <ThemeToggle />
      </header>

      {status === "idle" && <Dropzone />}

      {status === "previewing" && preview && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Preview</h2>
              <p className="text-sm text-[var(--ink-muted)]">
                {file?.name} · {preview.rows.length} row{preview.rows.length === 1 ? "" : "s"} ·{" "}
                {preview.headers.length} columns detected
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={reset}>
                Cancel
              </Button>
              <Button onClick={confirmImport}>Confirm &amp; import</Button>
            </div>
          </div>
          <VirtualizedTable columns={preview.headers} rows={preview.rows} />
        </section>
      )}

      {status === "processing" && (
        <section className="flex flex-col gap-4">
          <ProgressBar />
          <div>
            <Button variant="ghost" onClick={cancelImport}>
              Cancel import
            </Button>
          </div>
        </section>
      )}

      {status === "done" && (
        <section className="flex flex-col gap-4">
          <h2 className="font-medium">Import complete</h2>
          <ResultsView />
        </section>
      )}

      {status === "error" && (
        <section className="flex flex-col items-start gap-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-bg)] p-6">
          <p className="font-medium text-[var(--danger)]">Import failed</p>
          <p className="text-sm text-[var(--ink-muted)]">{errorMessage}</p>
          <Button variant="secondary" onClick={reset}>
            Start over
          </Button>
        </section>
      )}
    </main>
  );
}
