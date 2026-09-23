import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme, type ThemeProviderProps } from "next-themes";
import { themes } from "@/config/site";

/**
 * Returning visitors may carry a stored id from an earlier theme system, none
 * of which exist any more. Map each old id onto the One Bit rendition with the
 * same role (light / AAA light / dark / AAA dark) before next-themes reads
 * storage, otherwise they land with no theme class and a mislabelled switch.
 */
const LEGACY_THEMES: Record<string, string> = {
  // The Parts Catalogue (July 2026)
  stock: "xerox",
  "stock-hc": "xerox-hc",
  microfiche: "night",
  "microfiche-hc": "night-hc",
  // Ink & Ledger and older
  alucard: "xerox",
  paper: "xerox-hc",
  "dracula-pro": "night",
  dracula: "night",
  blade: "night",
  buffy: "night",
  lincoln: "night",
  morbius: "night",
  "van-helsing": "night",
  carbon: "night-hc",
  dark: "night",
  light: "xerox",
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

/** Keeps <meta name="theme-color"> on the active rendition's ground. */
function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    const color = themes.find((t) => t.id === resolvedTheme)?.color;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (color && meta) meta.setAttribute("content", color);
  }, [resolvedTheme]);
  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Runs once, before the first render commits, so next-themes reads the
  // migrated value rather than the retired one.
  useState(() => {
    migrateStoredTheme();
    return null;
  });

  return (
    <NextThemesProvider storageKey={STORAGE_KEY} {...props}>
      <ThemeColorMeta />
      {children}
    </NextThemesProvider>
  );
}
