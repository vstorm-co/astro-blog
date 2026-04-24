import { useLayoutEffect, useState } from "react";

type Theme = "light" | "dark";

function resolveTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("theme") === "light" ? "light" : "dark";
}

function apply(theme: Theme) {
  if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
}

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useLayoutEffect(() => {
    const initial = resolveTheme();
    setTheme(initial);
    apply(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") localStorage.setItem("theme", "light");
    else localStorage.removeItem("theme");
    apply(next);
  };

  return (
    <button
      type="button"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      onClick={toggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 6,
        border: "1px solid var(--color-border)",
        background: "transparent",
        color: "var(--color-text-secondary)",
        cursor: "pointer",
        transition: "color 0.15s, border-color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border-hover)";
        (e.currentTarget as HTMLButtonElement).style.background = "var(--color-surface)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
