# arda.tr

Personal landing site for Arda Karaduman, in the family design system "Kara
Duman" (see DESIGN.md).

The app is a single page with:

- a bar with the emblem and the arda.tr wordmark, the family nav and the scheme switch
- the name in blackletter beside an engraved plume of smoke
- Works: five categories (coze, gand, gand.games, music, github), each a block
  that opens to its entries
- About: the bio and a key-and-value table of facts
- Contact: the assistant, the résumé, email and profile links
- a floating chat widget backed by ai.arda.tr

## Stack

- Vite 8
- React 19
- ReScript
- Astryx (`@astryxdesign/core`) with the local `arda` theme
- TypeScript bridge files for the entry, the theme wrapper and tests
- Plain CSS on the theme's tokens
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
- `npm run test` runs the Vitest suite: the app shell, the catalogue data, the prerender, the chat transport, voice and markdown, the scheme switch, deep links, index.html's structured data, the 404 page, llms.txt and the sitemap
- `npm run verify` runs lint + typecheck + test
- `npm run build` creates the production bundle, prerenders the page into `dist/index.html` (`npm run prerender`, `scripts/prerender.mjs` with `src/entry-server.tsx`) and regenerates `dist/sitemap.xml`
- `npm run generate:sitemap` can be run separately if only metadata changed
- `npm run generate:site-config` regenerates the TypeScript site-config bridge from `config/site.config.json`
- `npm run generate:themes-contract` copies the built theme into `brand/` and regenerates `config/themes.json`, the committed contract (hashes of the brand files) the sibling sites check their copies against (CI fails if it goes stale)

## Project Layout

```text
brand/     the family's brand files: built theme, patterns, scheme switch, artwork, logo
config/    build, lint, TypeScript, and site metadata config
public/    static assets, including social preview images
scripts/   build-time helpers: the prerender and sitemap generation
src/       app code, ReScript sections and bindings, and generated config bridge
themes/    the Astryx `arda` theme's source
```

## Frontend Notes

- Typography uses:
  - `Grenze Gotisch` for names: the page's name, category names, section headings
  - `Spectral` for everything else
  - `JetBrains Mono` for dates and code
- The page is dark unless the visitor pins light with the bar's switch
  (`brand/scheme.js`, localStorage key `theme`).
- Controls are Astryx components, bound for ReScript in
  `src/bindings/Astryx.res`; the bar, the category block and the rest are the
  `ix-` patterns in `brand/brand.css`.
- The page sections are authored in ReScript and compiled in-source to ignored `.res.mjs` artifacts

## SEO And Metadata

- `public/og-image.jpg` is the primary social preview image used by the page metadata
- `config/site.config.json` is the canonical source for:
  - site URL
  - indexed pages
  - section IDs
- `src/config/site.generated.ts` is generated from `config/site.config.json` for the client app
- `scripts/prerender.mjs` renders the page to static markup on every build, so crawlers and readers without JavaScript get the text and links; the client then mounts over it with `createRoot`
- `scripts/generate-sitemap.mjs` generates `dist/sitemap.xml` on every build
- `scripts/generate-site-config-module.mjs` syncs the client-side config bridge from the canonical JSON file
- `index.html` contains:
  - canonical URL
  - Open Graph tags
  - Twitter card tags
  - JSON-LD: a WebSite, ProfilePage and Person graph

## Deployment

GitHub Actions builds and deploys the site to GitHub Pages on pushes to `main`.

## License

The code is [MIT-licensed](./LICENSE). Site content — personal text, imagery,
and project descriptions — is © Arda Karaduman, all rights reserved.
