# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal portfolio hub at arda.tr - a landing page featuring links to various sites (AI chatbot, blog, band, resume) and showcasing games and developer tools.

## Architecture

- **Framework**: Vite 5 + React 18 + TypeScript
- **Styling**: TailwindCSS with a small local UI layer
- **Theme Management**: next-themes with 7 Dracula Pro themes
- **Routing**: Single-page render without client-side routing
- **Deployment**: GitHub Pages

## Project Structure

```
.
├── config/                  # Build, lint, Tailwind, and site config
├── public/                  # Static assets (portfolio images, favicon, OG image)
├── scripts/                 # Build scripts (sitemap generation)
├── src/
│   ├── App.tsx              # Main app shell
│   ├── config/site.ts       # Shared site metadata and theme config
│   ├── components/          # Portfolio sections and local UI
│   ├── pages/Index.tsx      # Main landing page
│   └── lib/utils.ts         # Utility functions
├── index.html               # HTML template with SEO meta tags
└── tsconfig.json            # Root TypeScript reference file
```

## Common Commands

```bash
# Development server
npm run dev

# Production build (includes sitemap generation)
npm run build

# Typecheck + lint
npm run verify

# Preview production build
npm run preview

# Sitemap only
npm run generate:sitemap
```

## Key Implementation Details

### Theming

- 7 Dracula Pro themes: Pro (default), Alucard, Blade, Buffy, Lincoln, Morbius, Van Helsing
- CSS variables defined in `src/index.css` using HSL format
- Tailwind configured to use CSS variables via `config/tailwind.config.ts`
- `next-themes` package for theme switching
- `darkMode: ["class"]` configured in Tailwind
- Theme names stored in localStorage

### Design Style

- Anthropic-inspired minimal design
- Clean typography with generous spacing
- Subtle backgrounds and soft shadows
- Smooth transitions on interactions

### Sections

1. **Hero**: Name, title, location, CTA buttons (Resume, Blog, AI Chat)
2. **About**: Bio and professional highlights cards
3. **Portfolio**: Products, games, and tools
4. **Music Projects**: Music-related projects and profile links
5. **Footer**: Social links (GitHub, LinkedIn, Email, Pagan)

### SEO

- JSON-LD structured data (Person schema)
- OpenGraph and Twitter card meta tags
- Semantic HTML5 tags
- Sitemap auto-generated at build time from `config/site.config.json`
