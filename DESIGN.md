---
name: arda.tr
description: The index of the family system "The Index": everything Arda makes, as numbered entries in one list.
---

# Design System: arda.tr

arda.tr follows the family system **The Index** (adopted 2026-11-22; it replaces
"One Bit Forest"). The brand guide was generated in Moda; its written form, with
every token and rule, is `/DESIGN-SYSTEM.md` in the parent workspace. This file
records how arda.tr applies it, and what arda.tr owns for the family.

## Idea

**Everything he makes gets the same line in the same list.** arda.tr is the
index: level 4 of 4, the most expressive of the family. The display headline may
reach 120px here, every entry number is vermilion, and entries can be shown as
plates.

## What this repository owns

arda.tr is the family's source for the brand. The sibling sites carry verbatim
copies of the files in `brand/`, and their CI compares them with the hashes in
`config/themes.json` (contract **v4**).

| Path | What |
|---|---|
| `themes/arda/` | The Astryx theme. `arda.settings.json` belongs to `astryx experimental theme editor`; `arda.theme.ts` holds the type scale and the phone rule. The rest is built. |
| `src/themes/arda/`, `src/astryx-themes.ts` | The app's copy of the built theme, written by `astryx`. Never hand-edit. |
| `brand/arda.css`, `brand/arda.js` | The built theme, copied from `themes/arda/` by `npm run generate:themes-contract`. |
| `brand/brand.css` | The family patterns (`ix-` classes): the bar, the row, the key-and-value table, the plate, the label, the dot, chips, buttons, long-form text, the chat thread. |
| `brand/scheme.js` | The scheme switch: pin, unpin, old stored ids, the pre-paint snippet. |
| `brand/logo/` | Wordmark, monogram, favicon and the social card, outlined from Archivo 800 by `make-logo.cjs`. |

To change the theme: `npx astryx experimental theme editor set arda <thing> <value>`
(or edit `themes/arda/arda.theme.ts` and run
`npx astryx experimental theme compile themes/arda/arda.theme.ts`), look at
`npx astryx experimental theme editor show arda --png`, then
`npm run generate:themes-contract`, and copy `brand/` out to the siblings.

## Colour and scheme

Tokens are the Astryx theme's (`--color-background-body`, `--color-text-primary`,
`--color-accent`, …); the values are in `/DESIGN-SYSTEM.md`. No hex value appears
in `src/`.

- Light and dark, following the system. `<html data-astryx-theme="arda">` scopes
  the theme; `data-theme="light|dark"` is present only when the visitor pinned a
  scheme.
- The bar's switch names the scheme it switches to. It pins a scheme only when
  it differs from the system's, and clears the pin on the way back
  (`brand/scheme.js`, key `theme` in localStorage). Ids stored by earlier
  designs (`night`, `xerox`, …) map to `dark` or `light`.
- `index.html` and `public/404.html` inline `bootSnippet("theme")`, so a pinned
  scheme is applied before first paint. Astryx's `<Theme>` owns
  `<html data-theme>` after mount, so `App.tsx` passes the pin to it as `mode`
  and follows the switch through the `ix:scheme` event.
- Vermilion marks entry numbers, the dot and the primary button. Blue marks
  links and focus. Errors are crimson and say so in words.
- `prefers-contrast: more` strengthens hairlines and muted text.

## Type

Google Fonts, loaded in `index.html`: Archivo 700/800, IBM Plex Sans
400/400i/500/600, IBM Plex Mono 400/500. The seven-step scale is set in
`themes/arda/arda.theme.ts`.

- Display (`.ix-display`): the hero line, `clamp()` up to 120px.
- Heading 2 (Astryx `Heading level=2`): section titles.
- Row titles: IBM Plex Sans 500 at body size. Plate titles: Heading 3.
- Label (`.ix-label`, `.ix-num`): IBM Plex Mono 500, uppercase, 0.06em.

## Shape

Radius 0; 2px on buttons and inputs. 1px rules; a 2px ink rule opens each list.
No shadows, no gradients. Focus is a 2px blue outline. Everything is
left-aligned on a 12-column, 1200px grid with 24px gutters.

## Components

Controls and layout primitives are **Astryx components** (`@astryxdesign/core`),
bound for ReScript in `src/bindings/Astryx.res`: `Button`, `ToggleButtonGroup`,
`ToggleButton`, `Heading`, `HStack`, `VStack`, `Text`. The family's signature
patterns are the `ix-` classes of `brand/brand.css`, so the non-React sites draw
the same row. `src/index.css` holds only this page's own layout.

## Page

1. **Bar** (`Bar.res`, `Wordmark.res`): the wordmark, the nav (works, blog,
   résumé, ask, lind), the scheme switch, a 1px rule.
2. **Hero** (`Hero.res`): the name as the page's only `h1`, set as a label with
   the kicker beside it; the brand line "Everything I make, in one list." in the
   display face, closed by the vermilion full stop; one paragraph; "Browse
   works" (primary) and "Ask about Arda" (opens the chat).
3. **Works** (`Works.res`, `Entry.res`, `#catalogue`): the kind filter and the
   view switch (Astryx toggle groups), a live status line, then every entry.
   - **List** (default): the family row. Number (place in the list, three
     digits), kind code, title with its note beneath, status at right, with
     "Featured" and `src` where they apply.
   - **Plates**: the same entries as flat tiles: kind code, the number in
     Archivo 800, the entry's image uncropped, title, note, status. Featured
     entries are ink plates.
   - Both keep the entry's catalogue-number id (`#AK-2-0142`), and the title's
     link covers the whole row or plate.
4. **About** (`About.res`, `#record`): the bio in one 68-character column, then
   the facts as the key-and-value table.
5. **Contact** (`Colophon.res`, `footer#contact`): the profiles as a
   key-and-value table, then the colophon line under a rule.
6. **Chat** (`ChatWidget.res`): the launcher sits bottom-right. The assistant is
   the square dot from the wordmark and nothing else: it blinks while a reply is
   on its way and swells with the voice's loudness (`--ix-level`). The
   assistant's messages sit left beside the dot, the visitor's right in a sunken
   box; suggestions are chips; the input is a text field with a vermilion
   button. A bottom sheet under 720px.

## Motion

Only the assistant's dot moves. Under `prefers-reduced-motion` it does not.

## Mobile (below 720px)

- The bar's nav tightens and may wrap.
- A row stacks to two lines: number, kind and status above; title and note
  below.
- Plates go to one column.
- The chat becomes a bottom sheet.
- Nothing scrolls sideways.
