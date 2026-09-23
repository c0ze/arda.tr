# arda.tr

Personal landing site for Arda Karaduman, in the family design system "One Bit
Forest" (see DESIGN.md).

The app is a single page with:

- a hero, a dithered night forest in parallax, with the status bar and the name
- Works: every project, game, tool and record in one filterable card grid
- Record: career background as a spec sheet
- Contact: email and profile links
- a floating chat widget backed by ai.arda.tr

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
- `npm run generate:themes-contract` regenerates `config/themes.json`, the committed cross-site theme contract, from the theme blocks in `src/index.css` + `config/site.config.json` (CI fails if it goes stale)

## Project Layout

```text
config/    build, lint, Tailwind, TypeScript, and site metadata config
public/    static assets, including social preview images
scripts/   build-time helpers such as sitemap generation
src/       app code, ReScript sections, local UI primitives, and generated config bridge
```

## Frontend Notes

- Typography uses:
  - `Big Shoulders Display` for headings and names
  - `IBM Plex Sans` for body copy
  - `IBM Plex Mono` for UI, labels and meta
- Theme state is handled by `next-themes`. There are four renditions, listed in
  `config/site.config.json`: `night` (default), `night-hc`, `xerox` and
  `xerox-hc`.
- Canvas imagery and motion come from `src/lib/onebit.js`, the family's shared
  1-bit engine.
- The page sections are authored in ReScript and compiled in-source to ignored `.res.mjs` artifacts
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

## License

The code is [MIT-licensed](./LICENSE). Site content — personal text, imagery,
and project descriptions — is © Arda Karaduman, all rights reserved.
