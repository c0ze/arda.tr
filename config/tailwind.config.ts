import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,res}"],
  theme: {
    // No drop shadows in One Bit Forest — outside `extend` so Tailwind's
    // default shadow scale is replaced, not merged.
    boxShadow: {
      none: "none",
    },
    extend: {
      fontFamily: {
        // Headings and names, always uppercase.
        display: ['"Big Shoulders Display"', '"Arial Narrow"', "sans-serif"],
        // Body copy.
        sans: ['"IBM Plex Sans"', "system-ui", "-apple-system", "sans-serif"],
        // UI, labels, meta, nav, dates.
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      // Rendition tokens (src/index.css). Hex values, so no /opacity modifiers.
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        fg: "var(--fg)",
        "fg-2": "var(--fg-2)",
        rule: "var(--rule)",
        signal: "var(--signal)",
      },
      borderRadius: {
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
      },
    },
  },
  plugins: [],
} satisfies Config;
