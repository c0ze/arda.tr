import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,res}"],
  theme: {
    // The No Shadow Rule — outside `extend` so Tailwind's default shadow scale
    // is replaced, not merged. `shadow-md` etc. must not exist at all.
    boxShadow: {
      none: "none",
    },
    extend: {
      fontFamily: {
        // Condensed grotesque for catalogue headers and entry names.
        display: ['"Archivo Narrow"', '"Archivo"', "ui-sans-serif", "system-ui", "sans-serif"],
        // Workhorse grotesque for descriptions and prose.
        sans: ['"Archivo"', "system-ui", "-apple-system", "sans-serif"],
        // B612 Mono — drawn for Airbus flight decks. Carries every numeral.
        mono: ['"B612 Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        rule: "hsl(var(--rule))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Band code — kind encoding only. Never a background or a gradient.
        band: {
          1: "hsl(var(--band-1))",
          2: "hsl(var(--band-2))",
          3: "hsl(var(--band-3))",
          4: "hsl(var(--band-4))",
          5: "hsl(var(--band-5))",
          6: "hsl(var(--band-6))",
          7: "hsl(var(--band-7))",
          8: "hsl(var(--band-8))",
        },
      },
      // The Square Corner Rule.
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
