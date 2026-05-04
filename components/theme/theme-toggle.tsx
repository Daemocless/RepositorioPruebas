"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("booktracker-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: Theme =
      storedTheme === "light" || storedTheme === "dark"
        ? (storedTheme as Theme)
        : systemPrefersDark
          ? "dark"
          : "light";

    applyTheme(initialTheme);
    setTheme(initialTheme);
    setReady(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem("booktracker-theme", nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-500/40 bg-slate-900/50 px-4 text-sm font-medium text-slate-100 backdrop-blur transition hover:border-indigo-400/70 hover:bg-slate-800/70 dark:border-slate-500/40 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-800/70"
      aria-label="Cambiar tema"
    >
      <span>{ready && theme === "dark" ? "Modo oscuro" : "Modo claro"}</span>
    </button>
  );
}
