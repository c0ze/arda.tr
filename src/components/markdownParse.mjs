// Minimal Markdown parser for chat replies. Returns a plain-data block tree;
// the ReScript renderer (Markdown.res) turns it into React *elements* — never
// raw HTML — so model output cannot inject markup. Authored as plain JS (not
// inside a ReScript %raw template) to keep the regex escapes intact.
//
// Supported subset (what the ai.arda.tr bot actually emits):
//   **bold**, *italic* / _italic_, `code`, [text](url), nested one level,
//   "-" / "*" / "+" bullet lists, "1." ordered lists, ``` fenced code, paragraphs.
//
// parse(src, { live: true }) is for the reply still being written (streamed,
// or revealed as it is spoken). It reads the same text, never rewrites it, and
// only changes how the LAST block ends: an opener that is merely unclosed at
// the end marks everything after it (**bold, *italic, _italic, `code), an
// unfinished link shows its label, and a marker with nothing after it yet is
// hidden. An unclosed fence is already a code block to the end.

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

function tokenizeInline(input, depth = 0, live = false) {
  const s = String(input == null ? "" : input);
  const tokens = [];
  const starts = []; // offset of each token in s
  let pos = 0; // start of text not yet emitted
  let guard = 0;
  const INLINE = new RegExp(INLINE_SRC.source, "g"); // per call: nested calls run mid-scan
  const push = (tok, at) => {
    tokens.push(tok);
    starts.push(at);
  };
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
    if (m.index > pos) push({ t: "text", v: s.slice(pos, m.index) }, pos);
    if (m[1] != null) push(nest({ t: "bold", v: m[2] }, depth), m.index);
    else if (m[3] != null) push({ t: "code", v: m[4] }, m.index);
    else if (m[5] != null) push(nest({ t: "link", v: m[6], href: m[7] }, depth), m.index);
    else if (m[8] != null) push(nest({ t: "italic", v: m[9] }, depth), m.index);
    else if (m[10] != null) push(nest({ t: "italic", v: m[11] }, depth), m.index);
    pos = end;
  }
  if (pos < s.length) push({ t: "text", v: s.slice(pos) }, pos);
  const out = live ? liveEnd(s, tokens, starts, depth) : tokens;
  if (out.length === 0) out.push({ t: "text", v: "" });
  return out;
}

// ── Live mode ────────────────────────────────────────────────────────────

const isBlank = (ch) => ch === undefined || /\s/.test(ch);
// From the last "[" to the end: a label that is closed and a link target that
// is not ("[label](", "[label](https://partial").
const UNFINISHED_LINK = /^\[([^[\]\n]*)\]\((?:[^()[\]\s]|\([^()[\]\s]*\))*(?:\([^()[\]\s]*)?$/;

// The first opener in the plain text left over by the scan that nothing after
// it can close: a backtick with no backtick after it; a ** with no ** after it;
// a single * or _ that is the last one and opens emphasis by the boundary
// rules above (text after it, no word character before it); or the last "["
// starting an unfinished link. Every test is a lookup against offsets found
// in one pass, so this stays linear.
function pendingOpener(s, tokens, starts) {
  const lastTick = s.lastIndexOf("`");
  const lastDouble = s.lastIndexOf("**");
  const lastUnder = s.lastIndexOf("_");
  const lastBracket = s.lastIndexOf("[");
  let lastSingle = -1;
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === "*" && s[i - 1] !== "*" && s[i + 1] !== "*") {
      lastSingle = i;
      break;
    }
  }
  for (let k = 0; k < tokens.length; k++) {
    if (tokens[k].t !== "text") continue;
    const end = starts[k] + tokens[k].v.length;
    for (let p = starts[k]; p < end; p++) {
      const ch = s[p];
      if (ch === "`") {
        if (p === lastTick) return { k, p, kind: "code", len: 1 };
      } else if (ch === "*") {
        let run = 1;
        while (s[p + run] === "*") run++;
        if (run === 1) {
          if (p === lastSingle && !isBlank(s[p + 1]) && !flanked(charBefore(s, p), FLANK_STAR)) return { k, p, kind: "italic", len: 1 };
        } else {
          if (lastDouble <= p + run - 2 && !isBlank(s[p + 2])) return { k, p, kind: "bold", len: 2 };
          p += run - 1;
        }
      } else if (ch === "_") {
        if (p === lastUnder && s[p - 1] !== "_" && !isBlank(s[p + 1]) && !flanked(charBefore(s, p), FLANK)) {
          return { k, p, kind: "italic", len: 1 };
        }
      } else if (ch === "[" && p === lastBracket) {
        const m = UNFINISHED_LINK.exec(s.slice(p));
        if (m) return { k, p, kind: "label", label: m[1] };
      }
    }
  }
  return null;
}

const hideTrailingMarker = (v) => v.replace(/[*_`]+$/, "");

function liveEnd(s, tokens, starts, depth) {
  const hit = pendingOpener(s, tokens, starts);
  let out = tokens;
  if (hit) {
    out = tokens.slice(0, hit.k);
    if (hit.p > starts[hit.k]) out.push({ t: "text", v: s.slice(starts[hit.k], hit.p) });
    if (hit.kind === "label") {
      // Its label as plain text, with the label's own marks.
      out.push(...tokenizeInline(hit.label, depth + 1).filter((t) => t.v !== ""));
    } else {
      const rest = s.slice(hit.p + hit.len);
      if (hit.kind === "code") {
        if (rest !== "") out.push({ t: "code", v: rest });
      } else if (depth > 0) {
        const v = hideTrailingMarker(rest);
        if (v !== "") out.push({ t: hit.kind, v });
      } else {
        const c = tokenizeInline(rest, depth + 1, true);
        out.push(c.length === 1 && c[0].t === "text" ? { t: hit.kind, v: c[0].v } : { t: hit.kind, v: rest, c });
      }
    }
  }
  // A marker with nothing after it yet ("**", "a `", "2 *") is hidden.
  const last = out[out.length - 1];
  if (last && last.t === "text") {
    const v = hideTrailingMarker(last.v);
    out = v === "" ? out.slice(0, -1) : [...out.slice(0, -1), { t: "text", v }];
  }
  return out;
}

export function parse(src, { live = false } = {}) {
  const text = String(src == null ? "" : src);
  const lines = text.split("\n");
  const blocks = [];
  let i = 0;
  const blank = blankLine;
  let lastRaw = null; // the inline text of the last paragraph or list item

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
      // Live, an unclosed fence's last line may be the start of the closing
      // fence ("", "`", "``"): not shown yet.
      else if (live && code.length > 0 && /^\s*`{0,2}$/.test(code[code.length - 1])) code.pop();
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }
    // Unordered list.
    if (UL.test(line)) {
      const items = [];
      while (i < lines.length && UL.test(lines[i])) {
        lastRaw = lines[i].replace(UL, "$1");
        items.push(tokenizeInline(lastRaw));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    // Ordered list.
    if (OL.test(line)) {
      const items = [];
      while (i < lines.length && OL.test(lines[i])) {
        lastRaw = lines[i].replace(OL, "$1");
        items.push(tokenizeInline(lastRaw));
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
    lastRaw = para.join(" ");
    blocks.push({ type: "p", inline: tokenizeInline(lastRaw) });
  }
  // Live: the last block, if it is still open, ends as described above. A
  // blank line ends a paragraph, a line break a list item.
  const block = blocks[blocks.length - 1];
  if (live && block && block.type !== "code") {
    let trailing = 0;
    while (trailing < lines.length && blank(lines[lines.length - 1 - trailing])) trailing++;
    if (block.type === "p" && trailing <= 1) block.inline = tokenizeInline(lastRaw, 0, true);
    if (block.type !== "p" && trailing === 0) block.items[block.items.length - 1] = tokenizeInline(lastRaw, 0, true);
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

// The part of a reply the voice has reached: its first `n` UTF-16 units,
// never half a surrogate pair. Parse it in live mode; nothing is rewritten.
export function revealPrefix(text, n) {
  const s = String(text == null ? "" : text);
  if (n < 0 || n >= s.length) return s;
  const cut = s.slice(0, n);
  const last = cut.charCodeAt(cut.length - 1);
  return last >= 0xd800 && last <= 0xdbff ? cut.slice(0, -1) : cut;
}
