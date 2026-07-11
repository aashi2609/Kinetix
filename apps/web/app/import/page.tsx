"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useImportStore } from "@/stores/import-store";
import { useImportStream } from "@/lib/hooks/useImportStream";
import { Dropzone } from "@/components/upload/Dropzone";
import { ProgressBar } from "@/components/upload/ProgressBar";
import { VirtualizedTable } from "@/components/table/VirtualizedTable";
import { ResultsView } from "@/components/table/ResultsView";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

export default function ImportPage() {
  const { file, preview, status, errorMessage } = useImportStore();
  const reset = useImportStore((s) => s.reset);
  const { confirmImport, cancelImport } = useImportStream();

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-10">
      <header className="glass-panel flex items-center justify-between rounded-full px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
          <span className="font-display text-lg font-semibold">GrowEasy</span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="text-center">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          {status === "idle" && "Import your leads"}
          {status === "previewing" && "Preview before you import"}
          {status === "processing" && "AI is mapping your data"}
          {status === "done" && "Import complete"}
          {status === "error" && "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Any lead CSV — Facebook, Google Ads, or a manual spreadsheet — mapped straight into
          your CRM format.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div key="idle" {...fade}>
            <Dropzone />
          </motion.div>
        )}

        {status === "previewing" && preview && (
          <motion.section key="previewing" {...fade} className="flex flex-col gap-4">
            <div className="glass-panel flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
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
          </motion.section>
        )}

        {status === "processing" && (
          <motion.section key="processing" {...fade} className="flex flex-col gap-4">
            <ProgressBar />
            <div>
              <Button variant="ghost" onClick={cancelImport}>
                Cancel import
              </Button>
            </div>
          </motion.section>
        )}

        {status === "done" && (
          <motion.section key="done" {...fade} className="flex flex-col gap-4">
            <ResultsView />
          </motion.section>
        )}

        {status === "error" && (
          <motion.section
            key="error"
            {...fade}
            className="glass-panel flex flex-col items-start gap-3 rounded-2xl border-[var(--danger)]/30 p-6"
          >
            <p className="font-medium text-[var(--danger)]">Import failed</p>
            <p className="text-sm text-[var(--ink-muted)]">{errorMessage}</p>
            <Button variant="secondary" onClick={reset}>
              Start over
            </Button>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}