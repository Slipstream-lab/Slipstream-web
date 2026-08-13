"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "slipstream-theme";

/**
 * Light/dark toggle. The initial theme is applied before hydration by the
 * inline script in `app/layout.tsx` (system preference by default); this
 * component reflects the current class and persists the user's choice.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark, mounted]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded px-2 py-1 text-sm text-slate-600 ring-1 ring-slate-300 hover:text-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:text-slate-100"
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
}
