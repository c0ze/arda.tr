// Minimal Markdown parser for chat replies. Returns a plain-data block tree;
// the ReScript renderer (Markdown.res) turns it into React *elements* — never
// raw HTML — so model output cannot inject markup. Authored as plain JS (not
// inside a ReScript %raw template) to keep the regex escapes intact.
//
// Supported subset (what the ai.arda.tr bot actually emits):
//   **bold**, *italic* / _italic_, `code`, [text](url), nested one level,
//   "-" / "*" / "+" bullet lists, "1." ordered lists, ``` fenced code, paragraphs.

const UL = /^\s*[-*+]\s+(.*)$/;
const OL = /^\s*\d+\.\s+(.*)$/;
const FENCE = /^\s*```/;
const HEADING = /^\s*#{1,6}\s+/;
const blankLine = (l) => l.trim() === "";
// *italic* and _italic_ need non-blank text just inside the markers (regex)
// and no word character just outside them (checked in code, since lookbehind
// would break the bundle in Safari before 16.4). So rust_on_rails, URLs with
// underscores and 2 * 3 * 4 stay text. For "_" a word character is any letter
// or digit, "_" or "*"; for "*" only an ASCII letter or digit, "_" or "*", as in
// CommonMark: Japanese has no spaces, so これは*重要*です must be emphasis.
// A link's label holds no "[" or "]" and its URL no brackets, blanks or
// parentheses beyond one balanced pair (Wikipedia's Foo_(bar)), so every scan
// for a link stops at the next bracket or stray parenthesis: without that,
// each unmatched "[" rescanned the rest of the reply (quadratic on "[[[[…").
// An *italic* may hold **bold** pairs (*a **b** c*); a single "*" still ends it.
const INLINE_SRC =
  /(\*\*([\s\S]+?)\*\*)|(`([^`]+?)`)|(\[([^[\]]+?)\]\(((?:[^()[\]\s]|\([^()[\]\s]*\))+)\))|(\*((?:[^\s*]|\*\*[^*\n]+?\*\*)(?:(?:[^*\n]|\*\*[^*\n]+?\*\*)*?(?:[^\s*]|\*\*[^*\n]+?\*\*))?)\*)|(_([^\s_](?:[^_\n]*?[^\s_])?)_)/;
const FLANK = /[\p{L}\p{N}_*]/u;
const FLANK_STAR = /^[A-Za-z0-9_*]$/;
const flanked = (ch, re) => ch !== undefined && re.test(ch);
// The neighbours are read as whole code points, so a letter outside the BMP
// (𠮷, 𝑥) counts as a letter instead of half a surrogate pair.
const charBefore = (s, i) => {
  if (i <= 0) return undefined;
  const lo = s.charCodeAt(i - 1);
  if (lo >= 0xdc00 && lo <= 0xdfff && i >= 2) {
    const hi = s.charCodeAt(i - 2);
    if (hi >= 0xd800 && hi <= 0xdbff) return s.slice(i - 2, i);
  }
  return s[i - 1];
};
const charAfter = (s, i) => (i < s.length ? String.fromCodePoint(s.codePointAt(i)) : undefined);

// The text inside bold, italic and a link label is tokenized once more (into
// `c`, only when it holds marks of its own), so **[label](url)** and
// [**label**](url) render as written. One level is enough; a label cannot hold
// a link, since it cannot hold "]".
function nest(tok, depth) {
  if (depth > 0) return tok;
  const c = tokenizeInline(tok.v, depth + 1);
  return c.length === 1 && c[0].t === "text" ? tok : { ...tok, c };
}

function tokenizeInline(input, depth = 0) {
  const s = String(input == null ? "" : input);
  const tokens = [];
  let pos = 0; // start of text not yet emitted
  let guard = 0;
  const INLINE = new RegExp(INLINE_SRC.source, "g"); // per call: nested calls run mid-scan
  // Safety bound: past it, the remainder is kept as text rather than dropped.
  while (guard++ < 5000) {
    const m = INLINE.exec(s);
    if (!m) break;
    const end = m.index + m[0].length;
    const flank = m[8] != null ? FLANK_STAR : m[10] != null ? FLANK : null;
    if (flank && (flanked(charBefore(s, m.index), flank) || flanked(charAfter(s, end), flank))) {
      INLINE.lastIndex = m.index + 1; // not emphasis: look again one character on
      continue;
    }
    if (m.index > pos) tokens.push({ t: "text", v: s.slice(pos, m.index) });
    if (m[1] != null) tokens.push(nest({ t: "bold", v: m[2] }, depth));
    else if (m[3] != null) tokens.push({ t: "code", v: m[4] });
    else if (m[5] != null) tokens.push(nest({ t: "link", v: m[6], href: m[7] }, depth));
    else if (m[8] != null) tokens.push(nest({ t: "italic", v: m[9] }, depth));
    else if (m[10] != null) tokens.push(nest({ t: "italic", v: m[11] }, depth));
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
  const blank = blankLine;

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

// The reply as plain text, for the chat's screen-reader announcement: marks
// dropped, link labels without their URLs, blocks on their own lines.
const inlineText = (toks) => toks.map((t) => (t.c ? inlineText(t.c) : t.v)).join("");

export function plainText(src) {
  return parse(src)
    .map((b) => (b.type === "code" ? b.text : b.type === "p" ? inlineText(b.inline) : b.items.map(inlineText).join("\n")))
    .join("\n");
}

// ── Replies still being written ──────────────────────────────────────────
// While a reply streams, or is revealed as it is spoken, its last block is
// repaired before it is parsed: a half-typed link shows as its label, and an
// open **, ` or a trailing *italic / _italic opener is closed, so the words
// after it are not framed by raw markers until the closing half arrives.
// Code spans and fenced code are never changed, and earlier blocks are left
// as they are (each block is parsed on its own).

const isBlank = (ch) => ch === undefined || /\s/.test(ch);

// Character offsets of `t` inside code spans (backticks paired in order); an
// unpaired last backtick opens code to the end. Returns the masked text, with
// code replaced by \u0001, and that opener's offset (or -1).
function maskCode(t) {
  const ticks = [];
  for (let i = 0; i < t.length; i++) if (t[i] === "`") ticks.push(i);
  const open = ticks.length % 2 ? ticks[ticks.length - 1] : -1;
  const chars = t.split("");
  for (let k = 0; k + 1 < ticks.length; k += 2) for (let i = ticks[k]; i <= ticks[k + 1]; i++) chars[i] = "\u0001";
  if (open >= 0) for (let i = open; i < t.length; i++) chars[i] = "\u0001";
  return { m: chars.join(""), open };
}

// The last single `ch` (not part of a run like **), if it opens emphasis:
// text right after it, and no word character before it. Being the last, it
// has nothing to close it. Otherwise -1.
function loneOpener(m, ch, flank) {
  let at = m.length - 1;
  while (at >= 0) {
    if (m[at] !== ch) { at--; continue; }
    let start = at;
    while (start > 0 && m[start - 1] === ch) start--;
    if (start === at) break;
    at = start - 1;
  }
  if (at < 0 || isBlank(m[at + 1]) || flanked(charBefore(m, at), flank)) return -1;
  return at;
}

function repairInline(text) {
  let t = text;
  // A half-typed link (outside code) shows as its label.
  const link = /\[([^[\]\n]*)(\]\([^)\n]*)?$/.exec(maskCode(t).m);
  if (link) t = t.slice(0, link.index) + t.slice(link.index + 1, link.index + 1 + link[1].length);

  const { m, open: code } = maskCode(t);
  const bolds = m.match(/\*\*/g) || [];
  const bold = bolds.length % 2 ? m.lastIndexOf("**") : -1;
  const boldsBefore = (at) => (m.slice(0, at).match(/\*\*/g) || []).length;
  const openers = [];
  if (code >= 0) openers.push({ at: code, mark: "`" });
  if (bold >= 0) openers.push({ at: bold, mark: "**" });
  if (!isBlank(t[t.length - 1])) {
    // Inside a bold pair a closing * would read as ***: left alone.
    const star = loneOpener(m, "*", FLANK_STAR);
    if (star >= 0 && boldsBefore(star) % 2 === 0) openers.push({ at: star, mark: "*" });
    // _ may close inside an open bold, but not inside one already closed.
    const under = loneOpener(m, "_", FLANK);
    if (under >= 0 && !(boldsBefore(under) % 2 === 1 && m.indexOf("**", under) >= 0)) openers.push({ at: under, mark: "_" });
  }
  // Innermost (opened last) first; an opener with nothing after it yet is
  // dropped, not closed: "**" + "**" would show as "****".
  openers.sort((a, b) => b.at - a.at);
  for (const { at, mark } of openers) t = at === t.length - mark.length ? t.slice(0, at) : t + mark;
  return t;
}

export function closeOpenMarks(src) {
  const s = String(src == null ? "" : src);
  const lines = s.split("\n");
  let fences = 0;
  for (const l of lines) if (FENCE.test(l)) fences++;
  const last = lines.length - 1;
  // Inside an open fence the rest is code; after a blank line or a closing
  // fence the block being written has not started yet.
  if (fences % 2 || blankLine(lines[last]) || FENCE.test(lines[last])) return s;
  let i = last;
  if (!UL.test(lines[i]) && !OL.test(lines[i])) {
    while (i > 0 && !blankLine(lines[i - 1]) && !UL.test(lines[i - 1]) && !OL.test(lines[i - 1]) && !FENCE.test(lines[i - 1])) i--;
  }
  const tail = repairInline(lines.slice(i).join("\n"));
  return i > 0 ? lines.slice(0, i).join("\n") + "\n" + tail : tail;
}

// The part of a reply the voice has reached (`n` UTF-16 units of it), repaired
// as above: never half a surrogate pair or half a ** marker.
export function revealPrefix(text, n) {
  let s = String(text == null ? "" : text);
  if (n >= 0 && n < s.length) {
    const full = s;
    s = s.slice(0, n);
    const lastCode = s.charCodeAt(s.length - 1);
    if (lastCode >= 0xd800 && lastCode <= 0xdbff) s = s.slice(0, -1);
    if (s.endsWith("*") && full.charAt(s.length) === "*") s = s.slice(0, -1); // half a ** marker
  }
  return closeOpenMarks(s);
}
