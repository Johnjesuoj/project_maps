"use client";

import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("smaps-theme") as Theme | null;
    const initial = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("smaps-theme", next);
  }

  return (
    <button type="button" onClick={toggle} aria-label="Toggle light and dark mode">
      {theme === "dark" ? "☀ Light" : "◐ Dark"}
    </button>
  );
}
