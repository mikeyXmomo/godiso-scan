import { useEffect, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "lookscanned:theme";

function readStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system";
  }
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "system";
}

function systemPrefersDark(): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return systemPrefersDark() ? "dark" : "light";
  }
  return theme;
}

function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") {
    return;
  }
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

let currentTheme: Theme = "system";
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "system";
}

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function initializeTheme(): void {
  if (typeof window === "undefined") {
    return;
  }
  currentTheme = readStoredTheme();
  applyThemeToDocument(currentTheme);

  if (typeof window.matchMedia === "function") {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (): void => {
      if (currentTheme === "system") {
        applyThemeToDocument("system");
        emit();
      }
    };
    media.addEventListener("change", handler);
  }
}

export function setTheme(theme: Theme): void {
  currentTheme = theme;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }
  applyThemeToDocument(theme);
  emit();
}

export function useTheme(): {
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
  theme: Theme;
} {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolved = resolveTheme(theme);
  return { resolved, setTheme, theme };
}
