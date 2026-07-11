"use client";

import { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useCsvUpload } from "@/lib/hooks/useCsvUpload";

export function Dropzone() {
  const { handleFile } = useCsvUpload();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={clsx(
        "glass-panel group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-8 py-20 text-center transition-all duration-300",
        isDragging
          ? "scale-[1.01] border-[var(--brand)] shadow-[0_0_60px_-15px_var(--brand)]"
          : "border-[var(--border)] hover:border-[var(--brand)]/60"
      )}
    >
      <motion.div
        className="animate-float-y flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand)]/10"
        animate={isDragging ? { scale: 1.15 } : { scale: 1 }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="1.6"
        >
          <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <div>
        <p className="font-display text-lg font-medium">Drop your CSV here, or click to browse</p>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Any lead-export format works — Facebook, Google Ads, or a manual spreadsheet. Max 5MB.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}