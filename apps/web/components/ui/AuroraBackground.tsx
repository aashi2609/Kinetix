"use client";

import { useScroll, useTransform, motion } from "framer-motion";

/**
 * A generated, self-contained "dusk scene" backdrop — deep navy base, layered
 * soft-glow blobs, and a horizon band — rather than a licensed stock photo.
 * Gives the same "glass floating over a moody scene" impression as the
 * reference dashboard without any external image asset or copyright risk.
 * Blobs drift on their own via CSS, and additionally parallax against
 * scroll position for a bit of the kinetic, motion-led feel.
 */
export function AuroraBackground() {
  const { scrollY } = useScroll();
  const yA = useTransform(scrollY, [0, 1200], [0, -80]);
  const yB = useTransform(scrollY, [0, 1200], [0, 60]);
  const yC = useTransform(scrollY, [0, 1200], [0, -40]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg)]">
      <motion.div
        style={{ y: yA }}
        className="aurora-blob-a absolute -top-1/4 left-[8%] h-[62vh] w-[62vh] rounded-full opacity-40 blur-[120px]"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle, #5b6dff, transparent 70%)" }} />
      </motion.div>

      <motion.div
        style={{ y: yB }}
        className="aurora-blob-b absolute top-[18%] right-[4%] h-[58vh] w-[58vh] rounded-full opacity-35 blur-[120px]"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle, #9a6fff, transparent 70%)" }} />
      </motion.div>

      <motion.div
        style={{ y: yC }}
        className="aurora-blob-c absolute bottom-[-15%] left-[28%] h-[55vh] w-[55vh] rounded-full opacity-25 blur-[130px]"
      >
        <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle, #3fa0ff, transparent 70%)" }} />
      </motion.div>

      {/* Horizon glow band — evokes a dusk skyline sitting beneath the glass UI */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh] opacity-60"
        style={{
          background:
            "linear-gradient(to top, rgba(91,109,255,0.16), rgba(91,109,255,0.05) 40%, transparent 80%)",
        }}
      />

      {/* Vignette to keep edges dark and focus attention centrally, like the reference */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 20%, transparent 40%, rgba(2,3,8,0.55) 100%)",
        }}
      />

      <div className="bg-grain absolute inset-0" />
    </div>
  );
}