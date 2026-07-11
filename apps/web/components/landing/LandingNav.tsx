export function LandingNav() {
  return (
    <nav className="glass-panel sticky top-4 z-20 mx-auto flex w-[calc(100%-2rem)] max-w-5xl items-center justify-between rounded-full px-5 py-3">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
        <span className="font-display text-lg font-semibold">GrowEasy</span>
      </div>
      
      <a
        href="#how-it-works"
        className="hidden text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] sm:block"
      >
        How it works
      </a>
    </nav>
  );
}