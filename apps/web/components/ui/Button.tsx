"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "cta";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50",
        variant !== "cta" && "px-4 py-2.5 text-sm",
        variant === "primary" &&
          "bg-[var(--brand)] text-[#04140c] hover:bg-[var(--brand-dark)]",
        variant === "secondary" &&
          "border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--ink)] hover:border-[var(--brand)]",
        variant === "ghost" && "px-4 py-2.5 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]",
        variant === "cta" &&
          "group overflow-hidden rounded-full bg-[var(--brand)] px-7 py-3.5 text-base font-semibold text-[#04140c] shadow-[0_0_40px_-8px_var(--brand)] hover:shadow-[0_0_56px_-6px_var(--brand)] hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {props.children}
      {variant === "cta" && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      )}
    </button>
  );
}