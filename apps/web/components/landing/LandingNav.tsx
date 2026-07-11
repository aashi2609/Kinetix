import { Logo } from "@/components/ui/Logo";

export function LandingNav() {
  return (
    <nav className="glass-panel sticky top-4 z-20 mx-auto flex w-[calc(100%-2rem)] max-w-5xl items-center justify-between rounded-full px-5 py-3">
      <Logo size={24} />
      
      <a
        href="#how-it-works"
        className="hidden text-sm text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)] sm:block"
      >
        How it works
      </a>
    </nav>
  );
}