"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagneticWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    const relX = e.clientX - (bounds.left + bounds.width / 2);
    const relY = e.clientY - (bounds.top + bounds.height / 2);
    x.set(relX * 0.25);
    y.set(relY * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}