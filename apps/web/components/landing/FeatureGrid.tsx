"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: (
      <path d="M4 4h16v16H4V4zM4 9h16M9 9v11" strokeLinecap="round" strokeLinejoin="round" />
    ),
    title: "Any format in",
    body: "Drop a CSV from Facebook Ads, Google Ads, a real-estate CRM, or a spreadsheet you made by hand. Column names and layouts don't matter.",
  },
  {
    icon: (
      <path
        d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    title: "AI field mapping",
    body: "Gemini reads the columns and sample values, then intelligently maps them onto your fixed 15-field CRM schema — no manual configuration.",
  },
  {
    icon: <path d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z" strokeLinecap="round" strokeLinejoin="round" />,
    title: "Validated output",
    body: "Every record is re-checked against strict schema rules before import — bad dates, invalid statuses, and contact-less rows are cleanly separated out.",
  },
  {
    icon: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" strokeLinecap="round" strokeLinejoin="round" />,
    title: "Live progress",
    body: "Batches stream in as they finish, with real-time progress and automatic retries — large files never leave you staring at a dead spinner.",
  },
];

export function FeatureGrid() {
  return (
    <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center font-display text-2xl font-semibold sm:text-3xl"
      >
        How it works
      </motion.h2>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="glass-panel group rounded-2xl p-6 transition-transform hover:-translate-y-1"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="1.7"
              className="transition-transform group-hover:scale-110"
            >
              {f.icon}
            </svg>
            <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">{f.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}