# AGENTS.md

Codex working notes for this repository.

## Purpose

Maintain `arda.tr`, a single-page personal landing for Arda Karaduman: every
piece of work he has shipped, of every kind, in one grid. It is the "wild" member
of the One Bit Forest family (see `/DESIGN-SYSTEM.md` in the parent workspace).
Read DESIGN.md and PRODUCT.md before changing anything visual.

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
  (`main.tsx`, `App.tsx`, `ThemeProvider.tsx`, `ThemeToggle.tsx`,
  `TokyoClock.tsx`), the React `ErrorBoundary`, the Radix dropdown in
  `components/ui/`, `lib/utils.ts`, and `OneBit.tsx`, which mounts the canvas
  effects (bound for ReScript in `bindings/OneBit.res`). Don't grow this layer
  without a real reason.
- **`src/lib/onebit.js`** is the family's shared 1-bit engine, copied verbatim
  from `design-previews/onebit/onebit.js`. Do not fork it: change the
  design-previews copy first, then copy it to every site.
- **`src/lib/voice.js`** is the family's shared spoken-reply client (types in
  `voice.d.ts`, bound for ReScript in `bindings/Voice.res`), copied verbatim
  from `design-previews/onebit/voice.js` under the same rule. Its header
  documents the SSE voice protocol.
- **Content lives in `src/content/*Content.res`, never hardcoded in a component.**
  `CatalogContent.res` is the catalogue itself: every entry, its band (kind),
  and its catalogue number (the card's anchor id). `HeroContent.res` carries the
  status bar, the hero and the section prompts. `AboutContent.res` and
  `FooterContent.res` carry the record and contact. Keep it that way when
  editing text.
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
- `config/themes.json` is the generated, committed theme contract (v3: the
  four rendition ids, roles, required tokens and this site's values) that the
  sibling sites fetch from raw.githubusercontent.com. Never hand-edit it. Run
  `npm run generate:themes-contract` after touching theme CSS or theme
  metadata; the `theme-contract.yml` workflow fails if it drifts.
  `config/themes.v1.json` is the frozen v1 contract, kept for old readers.
- `scripts/generate-sitemap.mjs` regenerates the sitemap during builds.
- `src/components/ChatWidget.res` owns the chat transport and UI. Streaming completion requires a complete `done` event; interrupted replies retain received text and show an error. Requests fall back to `/api/chat` only before receiving text. The stream deadline is 45 s without data. Unless muted, requests carry `voice: true, lang: "en"` (from `voice.js` `requestFields`); one speaker per reply gates the visible text to what has been spoken, drives the orb's `level`, and is stopped on close, on a new question and on mute. The header's ♪ "Voice" toggle persists the choice site-wide (localStorage `voice`). Transport and React Strict Mode regressions run under `npm run verify` with mocked responses. `ChatWidget.voice.test.tsx` covers the voice path with a fake AudioContext and mocked speech events.

## Frontend Guardrails

- Keep the site a single-page experience unless there is a strong reason to add routing.
- Preserve the family type system (shared with resume.arda.tr, blog.arda.tr
  and ai.arda.tr):
  - `Big Shoulders Display` 800–900, uppercase, for the name, section titles
    and card names (`font-display`)
  - `IBM Plex Sans` for prose (`font-sans`)
  - `IBM Plex Mono` for UI, labels, meta and prompts (`font-mono`)
- Respect the visual direction (DESIGN.md is canonical):
  - renditions `night` (default), `night-hc`, `xerox`, `xerox-hc`
  - one signal colour (lichen), radius 0, no shadows, no gradients except the
    status bar scrim, 1px rules
  - all imagery is dithered live by `onebit.js`; any text over it sits on a
    solid `--bg` backing
  - all motion goes through `onebit.js`, which pauses off-screen and draws a
    still frame under reduced motion
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



<!-- ============================================================
UNRECONCILED — 6 lines that existed only in CLAUDE.md when CLAUDE.md and
AGENTS.md were consolidated (2026-08-08). Fold anything useful into the
sections above, then delete this block.
============================================================ -->

Claude Code there.
# CLAUDE.md
`*Content.res` content pattern, guardrails, accessibility, and SEO).
guidance (stack, architecture, the ReScript/TypeScript boundary, the
Read **AGENTS.md** first — it is canonical. This file only exists to point
This repository uses **[AGENTS.md](./AGENTS.md)** as the single source of agent
