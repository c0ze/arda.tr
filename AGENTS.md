# AGENTS.md

Codex working notes for this repository.

## Purpose

Maintain `arda.tr`, a single-page personal catalogue for Arda Karaduman — every
piece of work he has shipped, of every kind, as one flat ordered listing.
See DESIGN.md ("The Parts Catalogue") and PRODUCT.md before changing anything
visual.

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
  `CatalogContent.res` is the catalogue itself — every entry, its band, its
  catalogue number. `AboutContent.res` and `FooterContent.res` carry the
  maker record and back matter. Keep it that way when editing text.
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
- `config/themes.json` is the generated, committed theme contract that the
  sibling sites fetch from raw.githubusercontent.com. Never hand-edit it — run
  `npm run generate:themes-contract` after touching theme CSS or theme
  metadata (the `theme-contract.yml` workflow fails if it drifts).
- `scripts/generate-sitemap.mjs` regenerates the sitemap during builds.

## Frontend Guardrails

- Keep the site a single-page experience unless there is a strong reason to add routing.
- Preserve the current display/sans/mono type system (shared with
  resume.arda.tr, blog.arda.tr and ai.arda.tr):
  - `Archivo Narrow` for catalogue headers and entry names (`font-display`)
  - `Archivo` for descriptions and prose (`font-sans`)
  - `B612 Mono` for every numeral, label and spec value (`font-mono`)
- Respect the current visual direction (DESIGN.md is canonical):
  - zero border-radius, zero shadow, zero translucency
  - 1px hairline rules carry every structure; nothing floats
  - band colour encodes kind and nothing else
  - the only motion is a 120ms tone step on row hover
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

