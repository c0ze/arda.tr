// Minimal Markdown parser for chat replies. Returns a plain-data block tree;
// the ReScript renderer (Markdown.res) turns it into React *elements* — never
// raw HTML — so model output cannot inject markup. Authored as plain JS (not
// inside a ReScript %raw template) to keep the regex escapes intact.
//
// Supported subset (what the ai.arda.tr bot actually emits):
//   **bold**, *italic* / _italic_, `code`, [text](url),
//   "-" / "*" / "+" bullet lists, "1." ordered lists, ``` fenced code, paragraphs.

const UL = /^\s*[-*+]\s+(.*)$/;
const OL = /^\s*\d+\.\s+(.*)$/;
const FENCE = /^\s*```/;
const HEADING = /^\s*#{1,6}\s+/;
// *italic* and _italic_ need non-blank text just inside the markers (regex)
// and no letter, digit, "_" or "*" just outside them (checked in code, since
// lookbehind would break the bundle in Safari before 16.4). So rust_on_rails,
// URLs with underscores and 2 * 3 * 4 stay text.
const INLINE =
  /(\*\*([\s\S]+?)\*\*)|(`([^`]+?)`)|(\[([^\]]+?)\]\(([^)\s]+)\))|(\*([^\s*](?:[^*\n]*?[^\s*])?)\*)|(_([^\s_](?:[^_\n]*?[^\s_])?)_)/g;
const FLANK = /[\p{L}\p{N}_*]/u;
const flanked = (ch) => ch !== undefined && FLANK.test(ch);

function tokenizeInline(input) {
  const s = String(input == null ? "" : input);
  const tokens = [];
  let pos = 0; // start of text not yet emitted
  let guard = 0;
  INLINE.lastIndex = 0;
  // Safety bound: past it, the remainder is kept as text rather than dropped.
  while (guard++ < 5000) {
    const m = INLINE.exec(s);
    if (!m) break;
    const end = m.index + m[0].length;
    if ((m[8] != null || m[10] != null) && (flanked(s[m.index - 1]) || flanked(s[end]))) {
      INLINE.lastIndex = m.index + 1; // not emphasis: look again one character on
      continue;
    }
    if (m.index > pos) tokens.push({ t: "text", v: s.slice(pos, m.index) });
    if (m[1] != null) tokens.push({ t: "bold", v: m[2] });
    else if (m[3] != null) tokens.push({ t: "code", v: m[4] });
    else if (m[5] != null) tokens.push({ t: "link", v: m[6], href: m[7] });
    else if (m[8] != null) tokens.push({ t: "italic", v: m[9] });
    else if (m[10] != null) tokens.push({ t: "italic", v: m[11] });
    pos = end;
  }
  if (pos < s.length) tokens.push({ t: "text", v: s.slice(pos) });
  if (tokens.length === 0) tokens.push({ t: "text", v: "" });
  return tokens;
}

export function parse(src) {
  const text = String(src == null ? "" : src);
  const lines = text.split("\n");
  const blocks = [];
  let i = 0;
  const blank = (l) => l.trim() === "";

  while (i < lines.length) {
    const line = lines[i];
    if (blank(line)) {
      i++;
      continue;
    }
    // Fenced code block.
    if (FENCE.test(line)) {
      i++;
      const code = [];
      while (i < lines.length && !FENCE.test(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // consume the closing fence
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }
    // Unordered list.
    if (UL.test(line)) {
      const items = [];
      while (i < lines.length && UL.test(lines[i])) {
        items.push(tokenizeInline(lines[i].replace(UL, "$1")));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    // Ordered list.
    if (OL.test(line)) {
      const items = [];
      while (i < lines.length && OL.test(lines[i])) {
        items.push(tokenizeInline(lines[i].replace(OL, "$1")));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    // Paragraph: gather consecutive plain lines.
    const para = [];
    while (
      i < lines.length &&
      !blank(lines[i]) &&
      !UL.test(lines[i]) &&
      !OL.test(lines[i]) &&
      !FENCE.test(lines[i])
    ) {
      para.push(lines[i].replace(HEADING, ""));
      i++;
    }
    blocks.push({ type: "p", inline: tokenizeInline(para.join(" ")) });
  }
  return blocks;
}
