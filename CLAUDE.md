# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal portfolio hub at arda.tr. It is a single-page landing site that combines a personal profile, project showcase, music section, and social/profile links.

## Architecture

- **Framework**: Vite 8 + React 18 + ReScript
- **Styling**: TailwindCSS with a small local UI layer
- **Typography**: Lora for headings, DM Sans for body copy, JetBrains Mono for labels
- **Theme Management**: next-themes with 7 renamed palette variants
- **Routing**: Single-page render without client-side routing
- **Deployment**: GitHub Pages

## Project Structure

```
.
├── config/                  # Build, lint, Tailwind, and site config
├── public/                  # Static assets (portfolio images, favicon, OG image)
├── scripts/                 # Build scripts (sitemap + generated config bridge)
├── src/
│   ├── App.res              # Main ReScript page composition
│   ├── App.tsx              # Thin TS theme-provider wrapper around the ReScript app
│   ├── bindings/           # ReScript bindings to existing TS/JS React modules
│   ├── config/site.ts       # Shared site metadata bridge
│   ├── config/site.generated.ts # Generated from config/site.config.json
│   ├── components/          # ReScript page sections plus TS bridge components
│   └── lib/utils.ts         # Utility functions used by TS bridge UI primitives
├── index.html               # HTML template with SEO meta tags
├── rescript.json            # ReScript compiler configuration
└── tsconfig.json            # Root TypeScript reference file
```

## Common Commands

```bash
# Development server
npm run dev

# Regression test
npm run test

# Production build (includes sitemap generation)
npm run build

# Lint + typecheck + regression test
npm run verify

# Preview production build
npm run preview

# Sitemap only
npm run generate:sitemap
```

## Key Implementation Details

### Theming

- 7 palette variants: Void, Ivory, Abyss, Sakura, Amber, Ember, Steel
- CSS variables defined in `src/index.css` using HSL format
- Tailwind configured to use CSS variables via `config/tailwind.config.ts`
- `next-themes` package for theme switching
- `src/config/site.generated.ts` is generated from `config/site.config.json` and consumed by the client app
- `darkMode: ["class"]` configured in Tailwind
- Theme names stored in localStorage

### Design Style

- Editorial, high-contrast personal-brand aesthetic
- Serif/sans/mono type pairing with restrained motion
- Soft grid and blur treatments in the hero
- Card-based section layout for projects and music

### Sections

1. **Hero**: Name, title, location, CTA buttons (Resume, Blog, AI Chat)
2. **About**: Bio and professional highlights cards
3. **Portfolio**: Products, games, and tools
4. **Music Projects**: Music-related projects and profile links
5. **Footer**: Social links (GitHub, LinkedIn, Email, Pagan, Mastodon, Bluesky)

### SEO

- JSON-LD structured data (Person schema)
- OpenGraph and Twitter card meta tags
- Semantic HTML5 tags
- Sitemap auto-generated at build time from `config/site.config.json`
- Primary social image currently points to `public/og-image.jpg`
