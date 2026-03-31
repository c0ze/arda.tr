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
- ReScript
- TypeScript bridge files for config, theme/error wrappers, and tests
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
npm run test
npm run verify
npm run build
npm run preview
```

Command notes:

- `npm run dev` generates the site config bridge, starts the ReScript compiler in watch mode, and runs Vite
- `npm run test` runs a small regression test against the app shell
- `npm run verify` runs lint + typecheck + test
- `npm run build` creates the production bundle and regenerates `dist/sitemap.xml`
- `npm run generate:sitemap` can be run separately if only metadata changed
- `npm run generate:site-config` regenerates the TypeScript site-config bridge from `config/site.config.json`

## Project Layout

```text
config/    build, lint, Tailwind, TypeScript, and site metadata config
public/    static assets, including social preview images
scripts/   build-time helpers such as sitemap generation
src/       app code, ReScript sections, local UI primitives, and generated config bridge
```

## Frontend Notes

- Typography uses:
  - `Lora` for headings
  - `DM Sans` for body copy
  - `JetBrains Mono` for labels and technical accents
- Theme state is handled by `next-themes`
- The page sections are authored in ReScript and compiled in-source to ignored `.res.mjs` artifacts
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
- `src/config/site.generated.ts` is generated from `config/site.config.json` for the client app
- `scripts/generate-sitemap.mjs` generates `dist/sitemap.xml` on every build
- `scripts/generate-site-config-module.mjs` syncs the client-side config bridge from the canonical JSON file
- `index.html` contains:
  - canonical URL
  - Open Graph tags
  - Twitter card tags
  - JSON-LD person schema

## Deployment

GitHub Actions builds and deploys the site to GitHub Pages on pushes to `main`.
