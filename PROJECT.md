# PROJECT.md

Working notes for agents in this repository (the rules are in CLAUDE.md).

## Purpose

Maintain `arda.tr`, a single-page personal landing for Arda Karaduman: every
piece of work he has shipped, under five categories. It is the landing page of
the family system **Kara Duman** (see `/DESIGN-SYSTEM.md` in the parent workspace),
and the repository that owns the family's brand files (`brand/`, `themes/arda/`).
Read DESIGN.md and PRODUCT.md before changing anything visual.

The site should stay:

- professional
- editorial and typography-forward
- lightweight
- accessible
- SEO-conscious

## Stack

- Vite 8
- **ReScript** (page sections + content) compiled to JS, rendered by React 19
- **Astryx** (`@astryxdesign/core`, with the local `arda` theme) for controls
  and layout primitives; see the `astryx-project` skill in `.agents/skills/`
- TypeScript (thin interop layer only)
- Plain CSS on the theme's tokens (no Tailwind)
- npm only

## Architecture

The site is written in **ReScript**, with a deliberately small TypeScript interop
boundary. Stay inside this split:

- **ReScript (`.res`)** — all page sections (`src/components/*.res`), their
  bindings (`src/bindings/*.res`), and all copy/data (`src/content/*Content.res`).
  `bindings/Astryx.res` binds the Astryx components the page uses; add a prop
  there when a section needs it (`npx astryx component <Name>` lists them).
- **TypeScript (`.tsx`/`.ts`)** — only the interop shell: the entry
  (`main.tsx`), `App.tsx` (the Astryx `<Theme>` and its colour mode), the React
  `ErrorBoundary`, `lib/deepLink.ts` and the generated `astryx-themes.ts`. Don't
  grow this layer without a real reason.
- **`brand/`** is the family's brand, and this repository is its source:
  `arda.css` / `arda.js` (the built Astryx theme), `brand.css` (the `ix-`
  patterns), `scheme.js` (the scheme switch), `art/` (the artwork; `public/art/`
  is the copy this site serves) and `logo/`. The sibling sites carry
  verbatim copies. Change a file here, run `npm run generate:themes-contract`,
  then copy it out to them.
- **`themes/arda/`** is the theme's source. `arda.settings.json` is owned by
  `npx astryx experimental theme editor`; `arda.theme.ts` is hand-edited (the
  colours and the type scale). After a change: `npm run theme:build`, then look
  at `npx astryx experimental theme editor show arda --png`. `src/themes/arda/` and
  `src/astryx-themes.ts` are written by `astryx`; never hand-edit them.
- **CSS**: `src/layers.css` declares the cascade-layer order and is imported
  first; `src/index.css` imports Astryx's reset and component styles and
  `brand/brand.css`, then holds only this page's own layout. Every value is a
  theme token: no hex colours and no pixel font sizes in `src/`.
- **`src/lib/voice.js`** is the family's shared spoken-reply client (types in
  `voice.d.ts`, bound for ReScript in `bindings/Voice.res`), a verbatim copy of
  `design-previews/onebit/voice.js` in the parent workspace. Its header
  documents the SSE voice protocol.
- **Content lives in `src/content/*Content.res`, never hardcoded in a component.**
  `CatalogContent.res` is the works: the five categories, and every entry with
  its category, its group and its catalogue number (the entry's anchor id).
  `HeroContent.res` carries the bar, the hero and the works' labels.
  `AboutContent.res` and `FooterContent.res` carry about and contact. The chat's
  copy is the block of constants at the top of `ChatWidget.res`. Keep it that way
  when editing text.
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

- `config/` holds build, lint, TypeScript, and site metadata config.
- `src/` contains the app shell, page sections and bindings.
- `brand/` and `themes/arda/` hold the family's brand (see Architecture).
- `config/site.config.json` is the canonical source for:
  - site URL
  - indexed pages
  - section IDs
- `config/themes.json` is the generated, committed brand contract (**v4**: the
  sha256 of `brand/arda.css`, `arda.js`, `brand.css` and `scheme.js`) that the
  sibling sites fetch from raw.githubusercontent.com to check their copies.
  Never hand-edit it. Run `npm run generate:themes-contract` after touching the
  theme or anything in `brand/`; the `theme-contract.yml` workflow fails if it
  drifts. Merge a brand change here before the siblings: their checks pass with
  a note while this repository's `main` still publishes an older contract.
- The build prerenders the page: after `vite build`, `scripts/prerender.mjs`
  loads `src/entry-server.tsx` through Vite's SSR loader, renders the same tree
  `main.tsx` mounts with `renderToString`, and puts it into `dist/index.html`
  inside `<div id="root">`, so crawlers and readers without JavaScript get the
  text and links. It fails the build if
  the placeholder is missing, the render throws or React logs an error.
  `main.tsx` keeps `createRoot` (not `hydrateRoot`): React replaces the static
  markup on mount, so it never has to match exactly. Keep the static HTML free
  of anything build-specific (times, per-build randomness, paths): two builds
  should give a byte-identical `dist/index.html`. That is why the prerender
  never carries a pinned colour scheme: `App.tsx` reads it on the client only.
  `npm run dev` serves no
  prerendered markup. `src/test/prerender.test.tsx` renders it in Node.
- `scripts/generate-sitemap.mjs` regenerates the sitemap during builds. Its
  `<lastmod>` is the date of the last commit touching the content, so the
  deploy checks out full history (`fetch-depth: 0`).
- `src/components/ChatWidget.res` owns the chat transport and UI. Streaming completion requires a complete `done` event; interrupted replies retain received text and show an error. Requests fall back to `/api/chat` only when the stream most likely never reached the model: a network error, a timeout or dropped connection before any byte, HTTP 413 or a 5xx; other 4xx, an SSE `error` event and anything after the first byte are final and show the error. A question whose reply ended in an error is left out of later history, with its partial reply. The stream deadline is 45 s without data. Unless muted, requests carry `voice: true, lang: "en"` (from `voice.js` `requestFields`); one speaker per reply gates the visible text to what has been spoken, drives the ember's `--ix-level`, and is stopped on close, on a new question and on mute. The header's "Voice" toggle persists the choice site-wide (localStorage `voice`). Transport and React Strict Mode regressions run under `npm run verify` with mocked responses. `ChatWidget.voice.test.tsx` covers the voice path with a fake AudioContext and mocked speech events.

## Frontend Guardrails

- Keep the site a single-page experience unless there is a strong reason to add routing.
- Preserve the family type system (shared with resume.arda.tr, blog.arda.tr
  and ai.arda.tr; the scale is in `themes/arda/arda.theme.ts`):
  - `Grenze Gotisch` for names only: the page's name, category names, section
    headings. Never for running text, controls, capitals or anything under 28px
  - `Spectral` for everything else, nothing below 18px
  - `JetBrains Mono` for dates and code
- Respect the visual direction (DESIGN.md is canonical):
  - dark unless the visitor pins light
  - ember for links, numerals, the primary button and focus
  - 2px corners on controls, no shadows, 1px rules and hairlines, no boxes
  - the artwork never covers text or controls, and sits on a soot plate on paper
  - the only motion is the plume's slow drift and the ember's glow, and both stop
    under reduced motion
- Build UI from Astryx components and the `ix-` patterns; follow the
  `astryx-project` skill. Run `npx astryx doctor` after setup changes.
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
