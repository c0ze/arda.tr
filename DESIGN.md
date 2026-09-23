---
name: arda.tr
description: The wild member of the One Bit Forest family — a night forest dithered to one bit, one lichen-green phosphor.
---

# Design System: arda.tr

arda.tr follows the family system **One Bit Forest** (`/DESIGN-SYSTEM.md` in the
parent workspace, adopted 2026-09-23). This file records how arda.tr applies it.
The approved reference is section "01 · arda.tr" of
`design-previews/sketch-1bit.html`. It replaces "The Parts Catalogue" (July 2026).

## Idea

A programmer who plays black metal and loves old machines and pine forests. The
common ground is **1-bit dithering**: photocopied black-metal covers and early
Macs. One neon phosphor per site cuts through the monochrome. On arda.tr that
phosphor is **lichen**. Tone: wild.

Everything pictorial is dithered live by `src/lib/onebit.js` (a verbatim copy of
the family engine). There are no pre-dithered assets.

## Renditions

The next-themes class goes on `<html>`, and the preference is stored in the
`theme` localStorage key. Blocks are top-level rules in `src/index.css`.

| id | role | --bg | --surface | --fg | --fg-2 | --rule | --signal |
|---|---|---|---|---|---|---|---|
| `night` (default) | dark | `#060708` | `#0d0f10` | `#e4e0d4` | `#9d998e` | `#22252a` | `#c6ff3a` |
| `night-hc` | hc-dark (AAA) | `#000000` | `#000000` | `#ffffff` | `#d0cdc4` | `#8a8a8a` | `#d4ff5c` |
| `xerox` | light | `#efede6` | `#f7f6f1` | `#111210` | `#5d5b55` | `#cfccc2` | `#3f5f00` |
| `xerox-hc` | hc-light (AAA) | `#ffffff` | `#ffffff` | `#000000` | `#2e2e2e` | `#1a1a1a` | `#2b4200` |

- Canvas palette: `--ob-ink` = `--fg`, `--ob-ground` = `--bg`, `--ob-signal` =
  `--signal`. Always hex. The engine re-reads them every frame, so switching
  rendition repaints the canvases immediately. In xerox the forest therefore
  prints as a negative: pale trees and a dark moon on paper.
- Solid signal buttons set their label in `--bg`.
- Stored ids from older systems migrate by role in `ThemeProvider.tsx`
  (`stock` → `xerox`, `microfiche-hc` → `night-hc`, and so on).
- `config/themes.json` is the generated **v3** contract that the sibling sites
  read: ids, roles, names and required tokens. Regenerate it with
  `npm run generate:themes-contract`. `themes.v1.json` is kept for old readers.

## Type

Fonts load from Google Fonts in `index.html`.

- **Big Shoulders Display** 800–900, uppercase: the name, section titles and card
  names (`font-display`)
- **IBM Plex Sans**: intro, notes and bio (`font-sans`)
- **IBM Plex Mono**: the status bar, prompts, filters, meta, chat labels and input
  (`font-mono`)

## Geometry

- Radius 0 everywhere.
- No drop shadows and no gradients. The one exception is the status bar's scrim
  over the forest.
- Rules are 1px `--rule`. Grids are drawn as 1px gaps over a `--rule` ground.
- Focus ring: 2px solid `--signal`, offset 2px. Inside the bone contact bar it
  uses `--bg`.
- Any text over imagery sits on a solid `--bg` backing: the kicker, the intro,
  the mast tag and the Pagan plate. On screens under 900px the name gets a
  backing too.

## Page

1. **Hero** (`Hero.res`, `StatusBar.res`): a full-viewport `forest()` scrolling
   sideways in parallax.
   - The status bar: site mark, nav, `JST` clock and rendition switch.
   - Corner ticks and the single `h1` (the name), with the kicker and intro.
   - `ls ~/works ↓` (solid) and `ask ▸` (ghost), which dispatches `arda:open-chat`.
   - The Chofu coordinates tag, which follows the radio mast through `onMast`.
   - The Pagan logo, dithered, bottom-right.
2. **Works** (`Works.res`, `WorkCard.res`, `#catalogue`): opens with the prompt
   `ls -la works/ --kind=…`.
   - A kind filter styled as directory buttons (`aria-pressed`,
     `aria-controls`), plus a live status line with "clear filter".
   - A 4/2/1-column card grid. Each card has a hex index, the entry's image
     dithered (a seeded sigil when it has none), name, description, `kind/` and
     status. Live-ish statuses are set in signal.
   - Featured entries carry a small signal "featured" tag. Hover or focus
     develops a card's image again and tints it signal.
   - Cards keep their catalogue-number ids (`#AK-2-0142`).
3. **Record** (`Record.res`, `#record`): `cat ~/record`, then a `key: value` spec
   sheet beside the bio.
4. **Contact** (`Colophon.res`, `footer#contact`): a `treeline()` strip drifting
   at about 6px/s, then a bone bar with the mailto link, profiles and the
   colophon line.
5. **Chat** (`ChatWidget.res`): the launcher sits bottom-left.
   - The panel carries a revolving `orb()` that sizzles on every streamed chunk.
   - Messages are labelled `construct ▸` / `you ▸`, and a `crackle()` cursor
     trails the streaming reply.
   - Suggestions are numbered chips, and the input is a terminal line.

## Motion

All motion goes through `onebit.js`, mounted by `src/components/OneBit.tsx`.
Every animation pauses off-screen and in hidden tabs. Under
`prefers-reduced-motion` each one draws a single still frame, and the CSS stops
the prompt cursor from blinking.

## Mobile (≤ 700px)

- The bar drops the path and the clock.
- The name scales down to about 16.5vw.
- The Pagan plate shrinks.
- The kind filter becomes a 2-column grid.
- Cards go to one column under 560px.
- The chat becomes a bottom sheet.
- Nothing scrolls sideways.
