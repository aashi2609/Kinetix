import { Logo } from "@/components/ui/Logo";

export function LandingNav() {
  return (
    <nav className="glass-panel sticky top-4 z-20 mx-auto flex w-[calc(100%-2rem)] max-w-5xl items-center justify-between rounded-full px-4 py-2.5 sm:px-5 sm:py-3">
      <Logo size={22} />
      
      <a
        href="#how-it-works"
        className="text-xs text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] sm:text-sm"
      >
        How it works
      </a>
    </nav>
  );
}