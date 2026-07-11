"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MagneticWrap } from "@/components/ui/MagneticWrap";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const word = {
  hidden: { opacity: 0, y: "0.6em" },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const LINE_1 = ["Any", "CSV.", "Every", "format."];
const LINE_2 = ["One", "clean", "CRM", "import."];

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-20 sm:pt-24 md:pt-32">
      <motion.span
        initial="hidden"
        animate="show"
        custom={0}
        variants={fadeUp}
        className="glass-panel rounded-full px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-[var(--brand-dark)] sm:px-4 sm:text-xs"
      >
        AI-powered CRM data pipeline
      </motion.span>

      <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.1] sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl">
        <span className="block overflow-hidden pb-1">
          {LINE_1.map((w, i) => (
            <motion.span
              key={w}
              initial="hidden"
              animate="show"
              custom={0.08 * i}
              variants={word}
              className="inline-block"
            >
              {w}
              {i < LINE_1.length - 1 ? "\u00A0" : ""}
            </motion.span>
          ))}
        </span>
        <span className="block overflow-hidden pb-1 text-gradient-brand">
          {LINE_2.map((w, i) => (
            <motion.span
              key={w}
              initial="hidden"
              animate="show"
              custom={0.08 * (LINE_1.length + i)}
              variants={word}
              className="inline-block"
            >
              {w}
              {i < LINE_2.length - 1 ? "\u00A0" : ""}
            </motion.span>
          ))}
        </span>
      </h1>

      <motion.p
        initial="hidden"
        animate="show"
        custom={0.7}
        variants={fadeUp}
        className="mt-4 max-w-xl text-balance text-sm text-[var(--ink-muted)] sm:mt-6 sm:text-base md:text-lg"
      >
        Kinetix — An AI CSV importer that reads any lead export format and intelligently maps it to your CRM schema in seconds.
      </motion.p>

      <motion.div initial="hidden" animate="show" custom={0.8} variants={fadeUp} className="mt-8 sm:mt-10">
        <MagneticWrap>
          <Link href="/import">
            <Button variant="cta">
              Start parsing your files now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </Link>
        </MagneticWrap>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        custom={0.9}
        variants={fadeUp}
        className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.65rem] text-[var(--ink-muted)] sm:mt-16 sm:gap-x-8 sm:gap-y-3 sm:text-xs"
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
    <span className="flex items-baseline gap-1 sm:gap-1.5">
      <span className="font-display text-base font-semibold text-[var(--ink)] sm:text-lg">{value}</span>
      {label}
    </span>
  );
}

function Divider() {
  return <span className="hidden h-3 w-px bg-[var(--border)] sm:block" />;
}