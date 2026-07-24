import { useState } from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
import { themes } from "@/config/site";

/**
 * Returning visitors carry a stored theme id from the previous nine-theme
 * catalogue, none of which exist any more. Map the old ids onto the rendition
 * that matches their light/dark intent before next-themes reads storage,
 * otherwise they land with no theme class at all and a mislabelled picker.
 */
const LEGACY_THEMES: Record<string, string> = {
  alucard: "stock",
  paper: "stock-hc",
  "dracula-pro": "microfiche",
  dracula: "microfiche",
  blade: "microfiche",
  buffy: "microfiche",
  lincoln: "microfiche",
  morbius: "microfiche",
  "van-helsing": "microfiche",
  carbon: "microfiche-hc",
  dark: "microfiche",
  light: "stock",
};

const STORAGE_KEY = "theme";

function migrateStoredTheme() {
  if (typeof window === "undefined") return;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    if (themes.some((t) => t.id === stored)) return;
    const next = LEGACY_THEMES[stored];
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, next);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage unavailable (private mode, blocked cookies) — the default applies.
  }
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Runs once, before the first render commits, so next-themes reads the
  // migrated value rather than the retired one.
  useState(() => {
    migrateStoredTheme();
    return null;
  });

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
