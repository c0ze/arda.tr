# arda.tr

Personal portfolio site for Arda Karaduman.

The app is a single-page personal hub with:

- a hero section with resume, blog, and AI chat CTAs
- an about section with career background and highlights
- product, game, and tool showcases
- a music section with project links
- footer links for GitHub, LinkedIn, Mastodon, Bluesky, and more

## Stack

- Vite 8
- React 18
- TypeScript
- Tailwind CSS
- `next-themes`
- npm only

## Requirements

- Node.js `24.x`
- npm `11.x`

The repo is configured for:

```sh
node -v
# v24.x

npm -v
# 11.x
```

## Commands

```sh
npm ci
npm run dev
npm run verify
npm run build
npm run preview
```

Command notes:

- `npm run verify` runs lint + typecheck
- `npm run build` creates the production bundle and regenerates `dist/sitemap.xml`
- `npm run generate:sitemap` can be run separately if only metadata changed

## Project Layout

```text
config/    build, lint, Tailwind, TypeScript, and site metadata config
public/    static assets, including social preview images
scripts/   build-time helpers such as sitemap generation
src/       app code, sections, and local UI primitives
```

## Frontend Notes

- Typography uses:
  - `Lora` for headings
  - `DM Sans` for body copy
  - `JetBrains Mono` for labels and technical accents
- Theme state is handled by `next-themes`
- The current theme palette names live in `config/site.config.json`:
  - `Void`
  - `Ivory`
  - `Abyss`
  - `Sakura`
  - `Amber`
  - `Ember`
  - `Steel`
- The app is intentionally lightweight and avoids a large component framework

## SEO And Metadata

- `public/og-image.jpg` is the primary social preview image used by the page metadata
- `config/site.config.json` is the canonical source for:
  - site URL
  - indexed pages
  - section IDs
  - theme metadata
- `scripts/generate-sitemap.mjs` generates `dist/sitemap.xml` on every build
- `index.html` contains:
  - canonical URL
  - Open Graph tags
  - Twitter card tags
  - JSON-LD person schema

## Deployment

GitHub Actions builds and deploys the site to GitHub Pages on pushes to `main`.
