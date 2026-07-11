"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
      <motion.span
        initial="hidden"
        animate="show"
        custom={0}
        variants={fadeUp}
        className="glass-panel rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-[var(--brand)]"
      >
        AI-powered CRM data pipeline
      </motion.span>

      <motion.h1
        initial="hidden"
        animate="show"
        custom={0.1}
        variants={fadeUp}
        className="mt-6 font-display text-4xl font-semibold leading-[1.1] sm:text-6xl"
      >
        Any CSV. Every format.
        <br />
        <span className="text-gradient-brand">One clean CRM import.</span>
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="show"
        custom={0.2}
        variants={fadeUp}
        className="mt-6 max-w-xl text-balance text-base text-[var(--ink-muted)] sm:text-lg"
      >
        Stop wrestling with mismatched columns. Upload a lead export from Facebook, Google Ads,
        or a messy manual spreadsheet — AI reads it, maps it, and hands you back clean, validated
        CRM records in seconds.
      </motion.p>

      <motion.div initial="hidden" animate="show" custom={0.3} variants={fadeUp} className="mt-10">
        <Link href="/import">
          <Button variant="cta">
            Start parsing your files now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        custom={0.4}
        variants={fadeUp}
        className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-[var(--ink-muted)]"
      >
        <Stat value="15" label="CRM fields mapped" />
        <Divider />
        <Stat value="5MB" label="max upload" />
        <Divider />
        <Stat value="Live" label="streamed progress" />
      </motion.div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="font-display text-lg font-semibold text-[var(--ink)]">{value}</span>
      {label}
    </span>
  );
}

function Divider() {
  return <span className="hidden h-3 w-px bg-[var(--border)] sm:block" />;
}