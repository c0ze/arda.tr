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
// An optional quoted title after the URL ("…" or '…') is accepted and dropped.
// An *italic* may hold **bold** pairs (*a **b** c*); a single "*" still ends it.
// ***x*** is bold wrapping italic; it is tried before bold, which would
// otherwise take "*x" as its text and leave a stray "*".
const INLINE_SRC =
  /(\*\*\*([^\s*](?:[^*\n]*?[^\s*])?)\*\*\*)|(\*\*([\s\S]+?)\*\*)|(`([^`]+?)`)|(\[([^[\]]+?)\]\(((?:[^()[\]\s]|\([^()[\]\s]*\))+)(?:\s+(?:"[^"\n]*"|'[^'\n]*'))?\s*\))|(\*((?:[^\s*]|\*\*[^*\n]+?\*\*)(?:(?:[^*\n]|\*\*[^*\n]+?\*\*)*?(?:[^\s*]|\*\*[^*\n]+?\*\*))?)\*)|(_([^\s_](?:[^_\n]*?[^\s_])?)_)/;
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
  // Live: a run of one marker character at the very end may be half a mark
  // with nothing after it yet ("**bold _it_*"); the boundary rules read it as
  // the end of the text, and it is hidden below unless code holds it.
  const cut = live ? trailingRun(s) : s.length;
  const push = (tok, at) => {
    tokens.push(tok);
    starts.push(at);
  };
  // Safety bound: past it, the remainder is kept as text rather than dropped.
  while (guard++ < 5000) {
    const m = INLINE.exec(s);
    if (!m) break;
    const end = m.index + m[0].length;
    const flank = m[1] != null || m[10] != null ? FLANK_STAR : m[12] != null ? FLANK : null;
    const after = end === cut ? undefined : charAfter(s, end);
    if (flank && (flanked(charBefore(s, m.index), flank) || flanked(after, flank))) {
      INLINE.lastIndex = m.index + 1; // not emphasis: look again one character on
      continue;
    }
    if (m.index > pos) push({ t: "text", v: s.slice(pos, m.index) }, pos);
    if (m[1] != null) push({ t: "bold", v: `*${m[2]}*`, c: [{ t: "italic", v: m[2] }] }, m.index);
    else if (m[3] != null) push(nest({ t: "bold", v: m[4] }, depth), m.index);
    else if (m[5] != null) push({ t: "code", v: m[6] }, m.index);
    else if (m[7] != null) push(nest({ t: "link", v: m[8], href: m[9] }, depth), m.index);
    else if (m[10] != null) push(nest({ t: "italic", v: m[11] }, depth), m.index);
    else if (m[12] != null) push(nest({ t: "italic", v: m[13] }, depth), m.index);
    pos = end;
  }
  if (pos < s.length) push({ t: "text", v: s.slice(pos) }, pos);
  // Live: "***b c**" is ***b c*** on its way, not bold "*b c": when the scan
  // closed a longer run of stars with the trailing run, read it without that
  // run (hidden) instead.
  if (live && cut < s.length && s[cut] === "*" && pos === s.length && tokens.length > 0) {
    const at = starts[starts.length - 1];
    let open = 0;
    while (s[at + open] === "*") open++;
    if (tokens[tokens.length - 1].t !== "text" && open > s.length - cut) return tokenizeInline(s.slice(0, cut), depth, true);
  }
  const out = live ? liveEnd(s, tokens, starts, depth, cut) : tokens;
  if (out.length === 0) out.push({ t: "text", v: "" });
  return out;
}

// ── Live mode ────────────────────────────────────────────────────────────

const isBlank = (ch) => ch === undefined || /\s/.test(ch);
// From the last "[" to the end: a label that is closed and a link target that
// is not ("[label](", "[label](https://partial", "[label](url "Tit").
const UNFINISHED_LINK = /^\[([^[\]\n]*)\]\((?:[^()[\]\s]|\([^()[\]\s]*\))*(?:\([^()[\]\s]*)?(?:\s+(?:"[^"\n]*"?\s*|'[^'\n]*'?\s*)?)?$/;

// Where the run of one marker character (*, _ or `) that ends `s` starts, or
// s.length. A _ right after a word character (snake_) cannot open or close
// emphasis, so it is not a pending marker.
function trailingRun(s) {
  const ch = s[s.length - 1];
  if (ch !== "*" && ch !== "_" && ch !== "`") return s.length;
  let i = s.length - 1;
  while (i > 0 && s[i - 1] === ch) i--;
  if (ch === "_" && flanked(charBefore(s, i), FLANK)) return s.length;
  return i;
}

// The first opener in the text the scan left over (before the trailing run)
// that the rest could still close: a backtick with no backtick after it; a **
// with no ** after it; a single * or _ that opens by the boundary rules (text
// after it, no word character before it) with no single * (an italic holds
// none) or no _ after it; or the last "[" starting an unfinished link. Each
// test is a lookup against offsets found in one pass, so this stays linear.
function pendingOpener(s, tokens, starts, cut) {
  const sp = s.slice(0, cut);
  const lastTick = sp.lastIndexOf("`");
  const lastDouble = sp.lastIndexOf("**");
  const lastUnder = sp.lastIndexOf("_");
  const lastBracket = sp.lastIndexOf("[");
  let lastSingle = -1;
  for (let i = sp.length - 1; i >= 0; i--) {
    if (sp[i] === "*" && sp[i - 1] !== "*" && sp[i + 1] !== "*") {
      lastSingle = i;
      break;
    }
  }
  for (let k = 0; k < tokens.length; k++) {
    if (tokens[k].t !== "text") continue;
    const end = Math.min(starts[k] + tokens[k].v.length, cut);
    for (let p = starts[k]; p < end; p++) {
      const ch = sp[p];
      if (ch === "`") {
        if (p === lastTick) return { k, p, kind: "code", len: 1 };
      } else if (ch === "*") {
        let run = 1;
        while (sp[p + run] === "*") run++;
        if (run === 1) {
          if (p === lastSingle && !isBlank(sp[p + 1]) && !flanked(charBefore(sp, p), FLANK_STAR)) return { k, p, kind: "italic", len: 1 };
        } else {
          if (lastDouble <= p + run - 2 && !isBlank(sp[p + 2])) return { k, p, kind: "bold", len: 2 };
          p += run - 1;
        }
      } else if (ch === "_") {
        if (p === lastUnder && sp[p - 1] !== "_" && !isBlank(sp[p + 1]) && !flanked(charBefore(sp, p), FLANK)) {
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

function liveEnd(s, tokens, starts, depth, cut) {
  const hit = pendingOpener(s, tokens, starts, cut);
  if (!hit) {
    // The trailing run, if the scan left it as text, has nothing after it yet.
    const k = tokens.length - 1;
    if (cut < s.length && k >= 0 && tokens[k].t === "text" && starts[k] <= cut) {
      const v = s.slice(starts[k], cut);
      return v === "" ? tokens.slice(0, k) : [...tokens.slice(0, k), { t: "text", v }];
    }
    return tokens;
  }
  const out = tokens.slice(0, hit.k);
  if (hit.p > starts[hit.k]) out.push({ t: "text", v: s.slice(starts[hit.k], hit.p) });
  if (hit.kind === "label") {
    // Its label as plain text, with the label's own marks, read live too.
    out.push(...tokenizeInline(hit.label, depth + 1, true).filter((t) => t.v !== ""));
    return out;
  }
  // The rest is the mark's content, read live in turn (at the top level), so
  // its own trailing run is hidden there, unless a code span in it holds it.
  const rest = s.slice(hit.p + hit.len);
  if (hit.kind === "code") {
    if (rest !== "") out.push({ t: "code", v: rest });
    return out;
  }
  // Below the top level it is read once more without live mode (one level of
  // nesting, and a bound on the work: each live level rescans its text).
  const c = depth > 0 ? tokenizeInline(s.slice(hit.p + hit.len, cut), depth + 1) : tokenizeInline(rest, depth + 1, true);
  const shown = inlineText(c);
  if (shown === "") return out;
  if (depth > 0 || (c.length === 1 && c[0].t === "text")) out.push({ t: hit.kind, v: shown });
  else out.push({ t: hit.kind, v: s.slice(hit.p + hit.len, cut), c });
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
      // fence ("`", "``"): not shown yet.
      else if (live && code.length > 0 && /^\s*`{1,2}$/.test(code[code.length - 1])) code.pop();
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
