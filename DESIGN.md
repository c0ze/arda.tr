---
name: arda.tr
description: The landing page of the family system "Kara Duman": the name in blackletter, a plume of smoke, the works under five categories.
---

# Design System: arda.tr

arda.tr follows the family system **Kara Duman** (adopted 2026-11-23; it replaces
"The Index" of the day before and "One Bit Forest"). The brand and the four site
designs were generated in Moda; the written form, with every token and rule, is
`/DESIGN-SYSTEM.md` in the parent workspace, and captures of the Moda slides are in
`/output/rebrand-kara-duman/` there (this page is slides 11 and 12). This file
records how arda.tr applies it, and what arda.tr owns for the family.

## Idea

**His surname means black smoke.** Soot and bone, blackletter for names, Spectral
for everything else, one engraved plume of smoke, an ember. On arda.tr the plume
is at full size beside the name.

## What this repository owns

arda.tr is the family's source for the brand. The sibling sites carry verbatim
copies of the files in `brand/`, and their CI compares them with the hashes in
`config/themes.json` (contract **v4**).

| Path | What |
|---|---|
| `themes/arda/` | The Astryx theme. `arda.settings.json` belongs to `astryx experimental theme editor`; `arda.theme.ts` holds the colours and the type scale. The rest is built. |
| `src/themes/arda/`, `src/astryx-themes.ts` | The app's copy of the built theme, written by `astryx`. Never hand-edit. |
| `brand/arda.css`, `brand/arda.js` | The built theme, copied from `themes/arda/` by `npm run generate:themes-contract`. |
| `brand/brand.css` | The family patterns (`ix-` classes). |
| `brand/scheme.js` | The scheme switch: pin, unpin, old stored ids, the pre-paint snippet. |
| `brand/art/` | The artwork, exported from Moda and converted to bone lines on a transparent ground: `plume`, `wisp`, `forest`, `emblem`, and the `ember`. `public/art/` is the copy this site serves. |
| `brand/logo/` | The wordmark (outlined from Grenze Gotisch 800 by `make-logo.cjs`), the favicon glyph, the social card. |

To change the theme: `npx astryx experimental theme editor set arda <thing> <value>`
or edit `themes/arda/arda.theme.ts`, then `npm run theme:build`, look at
`npx astryx experimental theme editor show arda --png`, and copy `brand/` out to
the siblings.

## Colour and scheme

Tokens are the Astryx theme's; the values are in `/DESIGN-SYSTEM.md`. The five
brand colours that do not swap with the scheme (`--ix-soot`, `--ix-bone`,
`--ix-ember`, `--ix-moss`) are declared once in `brand/brand.css`. No hex value
appears in `src/`.

- **Dark unless the visitor pins light.** `index.html` and `public/404.html`
  inline `bootSnippet("theme", "dark")`, which puts the scheme on `<html
  data-theme>` before first paint. The bar's switch names the scheme it switches
  to, pins light, and clears the pin on the way back (`brand/scheme.js`, key
  `theme` in localStorage). Ids stored by earlier designs map to their role.
- Astryx's `<Theme>` owns `<html data-theme>` after mount, so `App.tsx` passes
  the scheme to it as `mode` and follows the switch through the `ix:scheme` event.
- Ember marks links, numerals, the primary button and focus. On bone paper links
  take the deeper ember and the primary button is bone on soot.
- On bone paper the artwork sits on a soot plate.

## Type

Google Fonts, loaded in `index.html`: Grenze Gotisch 700/800/900, Spectral
400/400i/600, JetBrains Mono 400/700. The scale is set in
`themes/arda/arda.theme.ts`. Blackletter names things: the name (`.ix-display`),
the category names (`.ix-name`), and the two section headings. Everything else is
Spectral; nothing is set below 18px.

## Components

Controls are **Astryx components** (`@astryxdesign/core`), bound for ReScript in
`src/bindings/Astryx.res`: `Button`, `Heading`, `HStack` (and `VStack`, `Text`,
the toggle group, for when a section needs them). The family's patterns are the
`ix-` classes of `brand/brand.css`, so the non-React sites draw the same things.
`src/index.css` holds only this page's own layout.

## Page

1. **Bar** (`Bar.res`, `Wordmark.res`): the emblem and the wordmark, the nav
   (works, blog, résumé, lind, and ask in ember), the scheme switch.
2. **The first screen** (`App.res`, `Hero.res`): the name as the page's only
   `h1`, in blackletter, one word to a line; the kicker; one paragraph. The plume
   is the right 45% and sits behind nothing; it drifts slowly, and not at all
   under reduced motion. Below 960px it is a 180px band between the bar and the
   name.
3. **Works** (`Works.res`, `#catalogue`): five categories, each a `<details>`
   block: coze, gand, gand.games, music, github. The summary row is a roman
   numeral, the name in blackletter with its plus or minus beside it, and a note
   in italics. The first is open on arrival; several can be open; they work
   without script. Inside, each entry is its name (a link) and what it is, with
   "source" where it has both a site and a repository; coze's games share one
   line. Every entry keeps its catalogue-number id (`#AK-2-0142`), and `App.tsx`
   opens the block that holds a deep link's target.
4. **About** (`About.res`, `#record`): the surname and what it means, the bio,
   the facts as a key-and-value table, a wisp in the margin.
5. **Contact** (`Colophon.res`, `footer#contact`): "Ask, or write"; the assistant
   (primary) and the résumé (outlined); the address and the profiles; the forest
   the plume rose from; the colophon line under a rule.
6. **Chat** (`ChatWidget.res`): the launcher sits bottom-right. The assistant is
   the ember: it glows while a reply is on its way and with the voice's loudness
   (`--ix-level`). Its messages sit left beside the ember, the visitor's right on
   the surface colour; suggestions are chips. A bottom sheet under 720px.

## Motion

The plume's slow drift and the ember's glow. Both stop under
`prefers-reduced-motion`.

## Not shown any more

Entries still carry `image`, `status` and `featured` in `CatalogContent.res`, and
the screenshots are still in `public/`; this design does not draw them.
