const SOURCES = [
  "Facebook Lead Ads",
  "Google Ads Export",
  "Real Estate CRM",
  "Sales Reports",
  "Marketing Agency CSVs",
  "Manual Spreadsheets",
  "Excel Exports",
];

export function SourceMarquee() {
  const doubled = [...SOURCES, ...SOURCES];

  return (
    <div className="relative overflow-hidden border-y border-[var(--border)] py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent" />
      <div className="animate-marquee flex w-max gap-10">
        {doubled.map((source, i) => (
          <span
            key={`${source}-${i}`}
            className="flex items-center gap-2 whitespace-nowrap text-sm text-[var(--ink-muted)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
            {source}
          </span>
        ))}
      </div>
    </div>
  );
}