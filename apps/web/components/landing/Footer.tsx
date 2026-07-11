"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MagneticWrap } from "@/components/ui/MagneticWrap";
import { Logo } from "@/components/ui/Logo";

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="glass-panel rounded-3xl px-8 py-14"
      >
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          Your leads are already messy. <br className="hidden sm:block" />
          Your import shouldn't be.
        </h2>
        <div className="mt-8">
          <MagneticWrap>
            <Link href="/import">
              <Button variant="cta">Start parsing your files now</Button>
            </Link>
          </MagneticWrap>
        </div>
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-3 border-t border-[var(--border)] px-6 py-10 text-center text-xs text-[var(--ink-muted)]">
      <Logo size={18} />
      <p>Kinetix — an AI CSV importer, built for the GrowEasy Software Developer assignment.</p>
    </footer>
  );
}