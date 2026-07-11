"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";

export function ThemeToggle() {
  // Dark is the intentional default for this app's aurora aesthetic —
  // only an explicit prior choice (not system preference) switches to light.
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const dark = stored ? stored === "dark" : true;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Button variant="ghost" onClick={toggle} aria-label="Toggle dark mode">
      {isDark ? "Light mode" : "Dark mode"}
    </Button>
  );
}