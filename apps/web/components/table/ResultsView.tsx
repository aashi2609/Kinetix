"use client";

import { useState } from "react";
import { useImportStore } from "@/stores/import-store";
import { VirtualizedTable } from "@/components/table/VirtualizedTable";
import { Button } from "@/components/ui/Button";

const CRM_COLUMNS = [
  "created_at",
  "name",
  "email",
  "country_code",
  "mobile_without_country_code",
  "company",
  "city",
  "state",
  "country",
  "lead_owner",
  "crm_status",
  "crm_note",
  "data_source",
  "possession_time",
  "description",
];

export function ResultsView() {
  const results = useImportStore((s) => s.results);
  const reset = useImportStore((s) => s.reset);
  const [tab, setTab] = useState<"imported" | "skipped">("imported");

  if (!results) return null;

  const { imported, skipped } = results;
  const total = imported.length + skipped.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard label="Total processed" value={total} />
        <StatCard label="Imported" value={imported.length} accent="brand" />
        <StatCard label="Skipped" value={skipped.length} accent="danger" />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto border-b border-[var(--border)]">
        <TabButton active={tab === "imported"} onClick={() => setTab("imported")}>
          Imported ({imported.length})
        </TabButton>
        <TabButton active={tab === "skipped"} onClick={() => setTab("skipped")}>
          Skipped ({skipped.length})
        </TabButton>
      </div>

      {tab === "imported" ? (
        <VirtualizedTable
          columns={CRM_COLUMNS}
          rows={imported as unknown as Record<string, string | null>[]}
        />
      ) : (
        <VirtualizedTable
          columns={["reason", ...Object.keys(skipped[0]?.row ?? {})]}
          rows={skipped.map((s) => ({ reason: s.reason, ...s.row }))}
          rowClassName={() => "bg-[var(--danger-bg)]"}
        />
      )}

      <div>
        <Button variant="secondary" onClick={reset}>
          Import another CSV
        </Button>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: "brand" | "danger" }) {
  return (
    <div className="glass-panel rounded-xl p-3 sm:rounded-2xl sm:p-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--ink-muted)] sm:text-xs">{label}</p>
      <p
        className="mt-0.5 font-display text-2xl sm:mt-1 sm:text-3xl"
        style={{ color: accent === "brand" ? "var(--brand)" : accent === "danger" ? "var(--danger)" : "var(--ink)" }}
      >
        {value}
      </p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
        active
          ? "border-[var(--brand)] text-[var(--ink)]"
          : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}
