// Writes the family's logo files (Kara Duman).
//   wordmark.svg / .json / .js  "arda.tr" outlined from Grenze Gotisch 800 (OFL), one colour
//   favicon.svg                 the small glyph: a solid A and one ember, on soot
// The engraved emblem (the burning A) is artwork, not type: brand/art/emblem.webp.
//
// Needs opentype.js and @fontsource/grenze-gotisch beside this script's node_modules
// (run it from a scratch folder: `node make-logo.cjs <out-dir> <node_modules-dir>`).
const fs = require('fs');
const path = require('path');
const out = process.argv[2];
const modules = process.argv[3];
const opentype = require(path.join(modules, 'opentype.js'));
const font = opentype.loadSync(path.join(modules, '@fontsource/grenze-gotisch/files/grenze-gotisch-latin-800-normal.woff'));
const r = (n) => Math.round(n * 100) / 100;

{
  const p = font.getPath('arda.tr', 0, 0, 100);
  const b = p.getBoundingBox();
  const w = r(b.x2 - b.x1), h = r(b.y2 - b.y1);
  const move = `translate(${r(-b.x1)} ${r(-b.y1)})`;
  const d = p.toPathData(2);
  fs.writeFileSync(path.join(out, 'wordmark.svg'),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="arda.tr">
  <path fill="currentColor" transform="${move}" d="${d}"/>
</svg>
`);
  const data = JSON.stringify({ viewBox: `0 0 ${w} ${h}`, transform: move, letters: d }, null, 2);
  fs.writeFileSync(path.join(out, 'wordmark.json'), data + '\n');
  // The same data as a module, for bundlers that will not import JSON from here.
  fs.writeFileSync(path.join(out, 'wordmark.js'), '// The arda.tr wordmark as path data (Grenze Gotisch 800). Written by make-logo.cjs; same data as wordmark.json.\nexport default ' + data + ';\n');
  console.log('wordmark', w, h);
}

// The favicon glyph, for 16 and 32px where the engraving closes up: the A cut
// to a solid shape, the smoke to one ember. Soot to the edge; bone; ember.
fs.writeFileSync(path.join(out, 'favicon.svg'),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-label="arda.tr">
  <rect width="160" height="160" fill="#0D0C0A"/>
  <circle cx="80" cy="32" r="11" fill="#E2502A"/>
  <path fill="#E8E0CE" fill-rule="evenodd" d="M80 52 126 136H101L93.5 121H66.5L59 136H34ZM80 88 72.5 106H87.5Z"/>
</svg>
`);
console.log('favicon ok');
