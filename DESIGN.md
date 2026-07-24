---
name: arda.tr
description: One person's output as a distributor parts catalogue — every kind of work an equal line item.
---

# Design System: arda.tr

## Overview

**Creative North Star: "The Parts Catalogue"**

The industrial distributor catalogue — Digi-Key, RS Components, the Radio Shack
parts annual — is the only document in this audience's world built on the
premise the site needs: a three-cent resistor and a four-hundred-dollar FPGA
get *identical row grammar*. Part number, description, spec columns, stock,
datasheet link. Radically different kinds of thing, zero hierarchy of dignity.
That is the whole argument this site has to make about one person who ships
cloud infrastructure, browser games, and atmospheric black metal.

The system is therefore a **table, not a story**. Its native register is dense,
utilitarian, and unsentimental — printed reference material, priced to be cheap
and built to be scanned. Warmth is not a goal; legibility, order, and density
are. Colour never decorates: it *encodes*, borrowed wholesale from the resistor
colour-band standard, which is both native to this field and a genuine ordering
system rather than a mood.

Two grounds are equally native and equally first-class: the printed page
(**Stock**) and the same catalogue photographed onto film (**Microfiche**).
Microfiche is authored, not an inversion — parts catalogues were genuinely
distributed on fiche, so the dark mode is a real artifact of the same world.

**Confirmed anti-references:** the dark developer-portfolio landing page
(oversized gradient name, stat trio, glass cards, "let's work together"); its
predictable opposite, the all-white Swiss type-only page; and the incumbent
arda.tr look this replaces — aurora blobs, film grain, glassmorphism, glow
shadows, gradient text.

**Key Characteristics:**

- Every entry is a line item with a catalogue number, whatever kind of thing it is
- Colour is a code, never an accent
- Hairline rules carry all structure; nothing floats
- Square corners without exception
- Tabular figures everywhere a number appears
- Density is the point, so typographic craft is the entire load-bearing wall

## Colors

Two grounds, one ink scale, and a functional eight-step band code lifted from
IEC 60062 resistor colours.

### Primary

- **Signal Band** — the active kind's band colour, whichever of the eight it is.
  There is no single brand accent by design; the "primary" is always whichever
  code the current row or section carries.

### Secondary

The **Band Code**, in numeric order. Each is a *kind of work*, not a decoration:

- **Brown / 1** (`#6B4A2F`): systems and infrastructure work
- **Red / 2** (`#C1272D`): shipped products
- **Orange / 3** (`#C66210`): games
- **Yellow / 4** (`#957A04`): writing
- **Green / 5** (`#2E8B4A`): open source and tools
- **Blue / 6** (`#2B5EA7`): recorded music
- **Violet / 7** (`#7B4FA3`): composed and generated music
- **Grey / 8** (`#737785`): archived and retired entries

Orange, yellow and grey are printed darker than their literal resistor hues
because the literal values could not clear WCAG 1.4.11 (3:1 non-text) against
Stock. Colour is this system's only encoding device; a band that cannot be seen
has stopped encoding. Each band lifts in Microfiche and darkens again in the two
high-contrast renditions.

### Neutral

**Stock** (light, the native rendition — uncoated catalogue paper, deliberately
cool and slightly green-grey, never cream):

- **Stock White** (`#F2F1ED`): the page
- **Stock Grey** (`#E3E1DB`): table headers, tab rails, the printed key block
- **Stock Band** (`#EDEBE4`): zebra banding — an opaque tone step, never alpha
- **Rule** (`#9D988B`): every hairline
- **Ink** (`#16161A`): all primary text
- **Ink Muted** (`#5A5A63`): spec values, secondary columns, captions

**Microfiche** (dark, authored — catalogue stock shot onto film):

- **Film Black** (`#0E0F12`): the page
- **Film Grey** (`#1A1C21`): zebra banding, headers, tab rails
- **Rule Film** (`#33363E`): every hairline
- **Emulsion** (`#E6E7EA`): all primary text
- **Emulsion Muted** (`#8A8D96`): spec values, secondary columns, captions

### Named Rules

**The One Band Rule.** A row carries exactly one band colour. If a piece of work
spans two kinds, it picks the one it is filed under; it does not get two bands.

**The Code, Not Decoration Rule.** Band colour appears only in a kind position —
the row's band, the section tab rail, the legend. It never tints a background,
never becomes a gradient, and never colours body text.

**The Cool Paper Rule.** The light ground is cool grey-white (`#F2F1ED`), never
cream, warm beige, or parchment. Warm paper belongs to a different world than
this one.

## Typography

**Display Font:** Archivo Narrow (with Archivo, system sans-serif)
**Body Font:** Archivo (with system sans-serif)
**Label/Mono Font:** B612 Mono (with ui-monospace, monospace)

**Character:** A condensed grotesque doing catalogue-header work over a cockpit
instrument mono doing every number. B612 Mono was drawn for Airbus flight-deck
displays — an instrument face from the same engineering world as the content,
chosen so the data columns read as *readouts* rather than as code.

### Hierarchy

- **Display** (Archivo Narrow, 700, `clamp(2rem, 4vw, 3.25rem)`, 1.05):
  section titles and the catalogue masthead. Set tight and uppercase.
- **Headline** (Archivo Narrow, 600, `1.5rem`, 1.15): entry titles inside a
  pulled-out record.
- **Title** (Archivo Narrow, 600, `1.0625rem`, 1.2): the entry name in a
  table row — the largest thing in the row, and the only thing set in the
  condensed face there.
- **Body** (Archivo, 400, `0.9375rem`, 1.55): descriptions and prose, capped at
  68ch.
- **Label** (B612 Mono, 400, `0.75rem`, `0.06em` tracking, uppercase): column
  headers, kind names, tab rails, legends.
- **Data** (B612 Mono, 400, `0.8125rem`, tabular figures always on): catalogue
  numbers, years, spec values, stock counts.

### Named Rules

**The Tabular Figures Rule.** Every numeral outside prose uses
`font-variant-numeric: tabular-nums`. Columns of numbers must align on the
digit, always.

**The Row Face Rule.** A table row uses the condensed face for the entry name,
the mono face for every number, label and spec value, and the body face for the
description column only. Nothing else enters a row.

## Layout

The page is a **ruled table**, not a stack of cards. A visible 1px rule grid
carries all structure: rules under the masthead, between every row, and around
every spec block. Content sits in a wide container (max `1440px`) with generous
outer gutters, because catalogues are wide and density needs the width.

A **full-bleed tab rail** runs down the left edge, `40px` wide on desktop,
carrying the current section's band colour and its kind label set vertically in
mono — the bleed tabs on a printed catalogue's page edge. This is where colour
commits at page scale.

**The listing** is the primary structure: one row per entry at a fixed `44px`
minimum with the description clamped to two lines, so the ruled rhythm stays
even down the page — ragged row heights are the fastest way for a table to stop
looking printed. Zebra-banded in Stock Band / Film Band. Columns are catalogue
number, band, name, description, spec cluster, year, and status.

**Featured entries** appear as a three-up plate strip above the listing,
normalised the way a catalogue normalises plates: one ground, one crop
discipline, numbered Fig. 1–3. Each cites its own catalogue number as a working
in-page anchor, so the dense table is genuinely one jump away.

**The key** is printed directly beneath the listing — band digit, swatch, kind,
note, plus how a catalogue number decodes. Without it the band code is a private
joke; a visitor who has never read IEC 60062 sees seven arbitrary colours.

Responsive: below `768px` the table becomes stacked spec cards, each retaining
its catalogue number, band, and column labels as inline `label: value` pairs.
The tab rail collapses to a `28px` band stripe. No columns are silently dropped;
they restack.

## Elevation & Depth

**This system has no shadows.** Depth is carried entirely by hairline rules,
zebra tone banding, and the two grounds. A printed catalogue page has no
elevation, and neither does this.

### Named Rules

**The No Shadow Rule.** `box-shadow` is not used anywhere, in any state,
including hover and focus. A surface that needs to separate from its neighbour
gets a rule or a tone step, never a shadow.

**The No Translucency Rule.** No `backdrop-filter`, no partial-alpha surfaces.
Paper is opaque and film is opaque.

## Shapes

**Radius is `0` everywhere, without exception** — rows, tabs, inputs, buttons,
images, the theme control. Printed catalogues have no rounded corners, and the
square corner is the single most recognisable silhouette cue this world has.

Borders are `1px` hairlines in the Rule colour, set at real ink contrast rather
than a soft grey — printed rules are black ink at hairline weight. Section
breaks earn a single `2px` rule; nothing heavier exists.

### Named Rules

**The Square Corner Rule.** `border-radius: 0` is a system invariant. The only
curves on the page live inside letterforms and inside content imagery.

## Do's and Don'ts

### Do:

- **Do** give every entry a catalogue number and a band code, whatever kind of
  thing it is — that equality is the system's entire argument.
- **Do** set every number in B612 Mono with tabular figures.
- **Do** carry structure with 1px hairline rules in `#C6C3BA` (Stock) or
  `#33363E` (Microfiche).
- **Do** author Microfiche as its own rendition, checking every pairing against
  it independently rather than inverting Stock.
- **Do** keep four modes — Stock, Stock HC, Microfiche, Microfiche HC — with the
  two HC modes targeting WCAG AAA, per the product's standing commitment.
- **Do** let hover raise a row's tone one band step; that is the form's own
  native motion.

### Don't:

- **Don't** use `border-radius` above `0` anywhere.
- **Don't** use `box-shadow`, `backdrop-filter`, glow, gradient text, ambient
  blobs, or grain — the incumbent look is the anti-reference.
- **Don't** let a band colour tint a background, a gradient, or body text; it
  marks kind and nothing else.
- **Don't** use cream, parchment, or warm beige as the light ground.
- **Don't** segregate the kinds into separate visual territories — one table
  absorbs all of them, which is the point.
- **Don't** add fade-up-on-scroll reveals; content is present on load, as a
  printed page is.
- **Don't** introduce Manrope, JetBrains Mono, or the incumbent purple ramp;
  they belong to the replaced world.
