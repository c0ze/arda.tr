// Outlines the arda.tr wordmark and the "a." monogram from Archivo 800 (OFL),
// following the brand guide: wordmark tracking -0.04em, the full stop recoloured;
// monogram glyphs at 0.775 of the tile, tracking -0.03em, centred.
const opentype = require('opentype.js');
const fs = require('fs');
const path = require('path');
const out = process.argv[2];
const font = opentype.loadSync(path.join(__dirname, 'node_modules/@fontsource/archivo/files/archivo-latin-800-normal.woff'));
const r = (n) => Math.round(n * 100) / 100;

function layout(text, size, tracking) {
  const scale = size / font.unitsPerEm;
  const glyphs = font.stringToGlyphs(text);
  let x = 0;
  const parts = [];
  glyphs.forEach((g, i) => {
    const p = g.getPath(x, 0, size);
    parts.push({ ch: text[i], path: p, bbox: p.getBoundingBox() });
    let adv = g.advanceWidth * scale;
    if (i < glyphs.length - 1) adv += font.getKerningValue(g, glyphs[i + 1]) * scale + tracking * size;
    x += adv;
  });
  return parts;
}
const d = (p) => p.toPathData(2);
function bounds(parts) {
  return parts.reduce((b, p) => ({ x1: Math.min(b.x1, p.bbox.x1), y1: Math.min(b.y1, p.bbox.y1), x2: Math.max(b.x2, p.bbox.x2), y2: Math.max(b.y2, p.bbox.y2) }), { x1: 1e9, y1: 1e9, x2: -1e9, y2: -1e9 });
}

// Wordmark: 100px type, cropped to the ink. Letters take currentColor; the dot
// takes --color-accent (falling back to the light-mode vermilion).
{
  const parts = layout('arda.tr', 100, -0.04);
  const b = bounds(parts);
  const w = r(b.x2 - b.x1), h = r(b.y2 - b.y1);
  const move = `translate(${r(-b.x1)} ${r(-b.y1)})`;
  const letters = parts.filter((p) => p.ch !== '.').map((p) => d(p.path)).join(' ');
  const dot = d(parts.find((p) => p.ch === '.').path);
  const dotBox = parts.find((p) => p.ch === '.').bbox;
  fs.writeFileSync(path.join(out, 'wordmark.svg'),
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="arda.tr">
  <g transform="${move}">
    <path fill="currentColor" d="${letters}"/>
    <path fill="var(--color-accent, #C2311A)" d="${dot}"/>
  </g>
</svg>
`);
  const data = JSON.stringify({ viewBox: `0 0 ${w} ${h}`, transform: move, letters, dot, dotSize: [r(dotBox.x2 - dotBox.x1), r(dotBox.y2 - dotBox.y1)] }, null, 2);
  fs.writeFileSync(path.join(out, 'wordmark.json'), data + '\n');
  // The same data as a module, for bundlers that will not import JSON from here.
  fs.writeFileSync(path.join(out, 'wordmark.js'), '// The arda.tr wordmark as path data (Archivo 800). Written by make-logo.cjs; same data as wordmark.json.\nexport default ' + data + ';\n');
  console.log('wordmark', w, h, 'dot', r(dotBox.x2 - dotBox.x1), r(dotBox.y2 - dotBox.y1));
}

// Monogram: 160px tile, "a." at 124px, centred on its ink.
function monogram(tile, letter, dotColour) {
  const T = 160, parts = layout('a.', 124, -0.03);
  const b = bounds(parts);
  const dx = r((T - (b.x2 - b.x1)) / 2 - b.x1), dy = r((T - (b.y2 - b.y1)) / 2 - b.y1);
  return { T, dx, dy, a: d(parts[0].path), dot: d(parts[1].path), tile, letter, dotColour };
}
function monoSvg(m, extraStyle = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m.T} ${m.T}" role="img" aria-label="arda.tr">${extraStyle}
  <rect class="t" width="${m.T}" height="${m.T}" fill="${m.tile}"/>
  <g transform="translate(${m.dx} ${m.dy})">
    <path class="a" fill="${m.letter}" d="${m.a}"/>
    <path class="d" fill="${m.dotColour}" d="${m.dot}"/>
  </g>
</svg>
`;
}
const onLight = monogram('#17160F', '#F5F2EA', '#FF7352'); // sits on light pages
const onDark = monogram('#EFEBE0', '#17160F', '#C2311A'); // sits on dark pages
fs.writeFileSync(path.join(out, 'monogram-on-light.svg'), monoSvg(onLight));
fs.writeFileSync(path.join(out, 'monogram-on-dark.svg'), monoSvg(onDark));
// Favicon: the on-light tile, switching to the on-dark tile when the browser UI is dark.
fs.writeFileSync(path.join(out, 'favicon.svg'), monoSvg(onLight, `
  <style>@media (prefers-color-scheme: dark) { .t { fill: #EFEBE0 } .a { fill: #17160F } .d { fill: #C2311A } }</style>`));
console.log('monogram offset', onLight.dx, onLight.dy);
