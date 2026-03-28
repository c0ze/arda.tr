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
- React 18
- TypeScript
- Tailwind CSS
- `next-themes`
- npm only

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
- Preserve the current serif/sans/mono type system:
  - `Lora` for headings
  - `DM Sans` for body text
  - `JetBrains Mono` for labels and technical accents
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

