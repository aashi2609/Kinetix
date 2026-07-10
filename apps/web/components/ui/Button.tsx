"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)]",
        variant === "secondary" &&
          "border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--ink)] hover:border-[var(--brand)]",
        variant === "ghost" && "text-[var(--ink-muted)] hover:text-[var(--ink)]",
        className
      )}
      {...props}
    />
  );
}
