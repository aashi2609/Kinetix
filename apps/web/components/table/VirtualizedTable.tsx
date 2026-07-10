"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";

interface VirtualizedTableProps {
  columns: string[];
  rows: Record<string, string | null | undefined>[];
  rowClassName?: (row: Record<string, string | null | undefined>, index: number) => string | undefined;
  maxHeight?: number;
}

const ROW_HEIGHT = 40;

export function VirtualizedTable({ columns, rows, rowClassName, maxHeight = 480 }: VirtualizedTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  });

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-6 py-16 text-center">
        <p className="font-medium">No rows to show</p>
        <p className="text-sm text-[var(--ink-muted)]">Upload a CSV to see a preview here.</p>
      </div>
    );
  }

  const items = virtualizer.getVirtualItems();

  return (
    <div
      ref={scrollRef}
      style={{ maxHeight }}
      className="relative overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]"
    >
      <table className="w-full min-w-max border-collapse text-sm font-mono-data">
        <thead className="sticky top-0 z-10 bg-[var(--bg-elevated)] shadow-[0_1px_0_var(--border)]">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap border-b border-[var(--border)] px-4 py-2.5 text-left font-sans text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ height: virtualizer.getTotalSize(), position: "relative", display: "block" }}>
          {items.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className={clsx(
                  "flex items-center border-b border-[var(--border)]/60",
                  rowClassName?.(row, virtualRow.index)
                )}
              >
                {columns.map((col) => (
                  <td key={col} className="flex-1 whitespace-nowrap px-4 py-2 text-[var(--ink)]">
                    {row[col] ?? <span className="text-[var(--ink-muted)]">—</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
