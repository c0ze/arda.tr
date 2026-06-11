# AGENTS.md

Codex working notes for this repository.

## Purpose

Maintain `arda.tr`, a single-page personal portfolio for Arda Karaduman.

The site should stay:

- professional
- editorial and typography-forward
- lightweight
- accessible
- SEO-conscious

## Stack

- Vite 8
- **ReScript** (page sections + content) compiled to JS, rendered by React 18
- TypeScript (thin interop layer only)
- Tailwind CSS
- `next-themes`
- npm only

## Architecture

The site is written in **ReScript**, with a deliberately small TypeScript interop
boundary. Stay inside this split:

- **ReScript (`.res`)** — all page sections (`src/components/*.res`), their
  bindings (`src/bindings/*.res`), and all copy/data (`src/content/*Content.res`).
- **TypeScript (`.tsx`/`.ts`)** — only the interop shell: the entry/provider
  (`main.tsx`, `App.tsx`, `ThemeProvider.tsx`, `ThemeToggle.tsx`), the React
  `ErrorBoundary`, the shadcn primitives in `components/ui/` (wrapped by `.res`
  bindings), and `lib/utils.ts`. Don't grow this layer without a real reason.
- **Content lives in `src/content/*Content.res`, never hardcoded in a component.**
  Each section (`Hero`, `About`, `Portfolio`, `Music`, `Footer`) reads its copy
  and data from its matching `*Content.res`. Keep it that way when editing text.
- `src/config/site.generated.ts` is generated from `config/site.config.json` by
  `scripts/generate-site-config-module.mjs` (run via the `prepare` hook and the
  build); it is gitignored — edit the JSON, not the generated file.

## Useful Commands

```sh
npm run dev
npm run verify
npm run build
npm run preview
npm run generate:sitemap
```

Use the user's current toolchain via mise when verifying locally:

```sh
mise exec node@24.14.0 -- npm run verify
```

## Repo Shape

- `config/` holds build, lint, Tailwind, TypeScript, and site metadata config.
- `src/` contains the app shell, page sections, and minimal local UI primitives.
- `config/site.config.json` is the canonical source for:
  - site URL
  - indexed pages
  - section IDs
  - theme metadata
- `scripts/generate-sitemap.mjs` regenerates the sitemap during builds.

## Frontend Guardrails

- Keep the site a single-page experience unless there is a strong reason to add routing.
- Preserve the current display/sans/mono type system (shared with
  resume.arda.tr, blog.arda.tr and ai.arda.tr):
  - `Archivo` for headings (`font-display`)
  - `Manrope` for body text (`font-sans`)
  - `JetBrains Mono` for labels and technical accents (`font-mono`)
- Respect the current visual direction:
  - restrained motion
  - soft grid/background atmosphere
  - strong contrast
  - card-based content sections
- Avoid template bloat and unnecessary dependencies.

## Accessibility And UX

- Use semantic HTML sections and headings.
- Keep keyboard focus states and interactive hit targets intact.
- Respect `prefers-reduced-motion` when adding or changing animations.
- Maintain WCAG-conscious contrast across all themes.

## SEO And Content

- Keep metadata, JSON-LD, OG/Twitter tags, and footer/profile links aligned.
- Ensure `robots.txt`, sitemap generation, and canonical URLs stay correct.
- Keep image paths in metadata in sync with actual assets in `public/`.
- Current follow-up worth remembering:
  - consider adding Bluesky to the JSON-LD `sameAs` list if structured data should mirror the footer exactly

