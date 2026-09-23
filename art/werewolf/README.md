# Werewolf sprite

The werewolf that crosses the forest on the landing page.

1. `prompt.md` was given to Codex, which drew `werewolf-sheet.png` with its built-in image generator
   (8 frames: a 6-frame run cycle, rising, howling).
2. `cut.py` separates each figure from the white background (flood fill from the border, so the white
   rim lines inside the silhouette stay part of the body) and aligns the frames on a common baseline:
   `python3 cut.py` (needs numpy and Pillow) writes `frame01.png`…`frame08.png`.
3. `build.lua` assembles those frames in Aseprite, tags them (`run` 1–6, `rise` 7, `howl` 8), scales the
   sprite to 96 px tall and exports the sheet:
   `aseprite -b --script-param dir=$PWD --script build.lua` writes `werewolf.aseprite`, `werewolf.png`
   and `werewolf.json`.
4. Copy `werewolf.png` to `public/werewolf.png`. The forest engine (`src/lib/onebit.js`) scales it to the
   scene and dithers its shading to 1 bit at runtime.

Edit `werewolf.aseprite` directly to adjust the animation, then re-export the sheet.
