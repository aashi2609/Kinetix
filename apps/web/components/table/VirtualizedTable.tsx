"use client";

import clsx from "clsx";

interface VirtualizedTableProps {
  columns: string[];
  rows: Record<string, string | null | undefined>[];
  rowClassName?: (row: Record<string, string | null | undefined>, index: number) => string | undefined;
  maxHeight?: number;
}

// Format column names for display
function formatColumnName(col: string): string {
  return col
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format cell values
function formatCellValue(value: string | null | undefined, columnName: string): string {
  if (!value || value === 'null') return '—';
  
  // Format dates
  if (columnName === 'created_at' && value !== 'unknown') {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch {
      // Fall through to return raw value
    }
  }
  
  return value;
}

export function VirtualizedTable({ columns, rows, rowClassName, maxHeight = 600 }: VirtualizedTableProps) {
  if (rows.length === 0) {
    return (
      <div className="glass-panel flex flex-col items-center gap-2 rounded-2xl px-4 py-12 text-center sm:px-6 sm:py-16">
        <p className="font-medium">No rows to show</p>
        <p className="text-xs text-[var(--ink-muted)] sm:text-sm">Upload a CSV to see a preview here.</p>
      </div>
    );
  }

  return (
    <div
      style={{ maxHeight }}
      className="glass-panel relative overflow-auto rounded-2xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--bg)] backdrop-blur-lg">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap border-b border-[var(--border)] px-3 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--ink-muted)] sm:px-4 sm:py-3 sm:text-xs"
                >
                  {formatColumnName(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className={clsx(
                  "border-b border-[var(--border)]/40 transition-colors hover:bg-[var(--brand)]/5",
                  rowClassName?.(row, index)
                )}
              >
                {columns.map((col) => (
                  <td key={col} className="whitespace-nowrap px-3 py-2 text-[var(--ink)] sm:px-4 sm:py-3">
                    {formatCellValue(row[col], col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
