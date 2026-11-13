import { describe, expect, it } from "vitest";
import { parse, revealPrefix } from "../components/markdownParse.mjs";

// The reply still being written (streamed, or revealed as it is spoken) is
// parsed in live mode: an opener that is merely unclosed at the end marks
// everything after it, an unfinished link shows its label, and nothing is
// ever rewritten, so code cannot change and a closer is never taken for an
// opener. Only the last block is affected.

const live = (text) => parse(text, { live: true });
const inline = (text) => live(text).at(-1).inline;

// Visible text outside code, and the text of code spans and blocks, in order.
function flatten(blocks) {
  let text = "";
  let code = "";
  const walk = (toks) => {
    for (const t of toks) {
      if (t.t === "code") code += t.v + "\u0000";
      else if (t.c) walk(t.c);
      else text += t.v;
    }
  };
  for (const b of blocks) {
    if (b.type === "code") code += b.text + "\u0000";
    else if (b.type === "p") walk(b.inline);
    else for (const item of b.items) walk(item);
    text += "\n";
  }
  return { text, code };
}

const count = (s, sub) => s.split(sub).length - 1;

const replies = [
  "## What he builds\n\nArda builds **systems** and *games*. See [golem](https://github.com/c0ze/golem) or **[the blog](https://blog.arda.tr)**.\n\n- Ruby and `Go`\n- *a **nested** case*\n- 2 * 3 = 6, and 2*3*4\n\n```js\nconst a = \"**not bold** [x\";\n```\n\nUse `**` for bold and `a [b` for nothing.\n",
  "これは*重要*です。**太字**と`コード`、そして_斜体_。",
  "1. First `x * y`\n2. Second [docs](https://x.y/a_(b)) _it_\n\nDone.",
  "Plain text with snake_case and rust_on_rails, then *emphasis with `code` inside* and **bold with `code`**.",
  'Titled [docs](https://example.com "Documentation") and [more](https://x.y \'More\').',
  "A [**bold label**](https://example.com) and `[not a link](x)` here.\n\n```\nunclosed fence **x",
];

describe("live parsing of a reply still being written", () => {
  it("marks the rest of the reply with an unclosed opener", () => {
    expect(inline("He builds **golem and `rust_on")).toEqual([
      { t: "text", v: "He builds " },
      { t: "bold", v: "golem and `rust_on", c: [{ t: "text", v: "golem and " }, { t: "code", v: "rust_on" }] },
    ]);
    expect(inline("*a **b")).toEqual([{ t: "italic", v: "a **b", c: [{ t: "text", v: "a " }, { t: "bold", v: "b" }] }]);
    expect(inline("call _init")).toEqual([{ t: "text", v: "call " }, { t: "italic", v: "init" }]);
  });

  it("never changes code", () => {
    expect(inline("Use `**` syntax")).toEqual([{ t: "text", v: "Use " }, { t: "code", v: "**" }, { t: "text", v: " syntax" }]);
    expect(inline("Use `a [b` syntax")).toEqual([{ t: "text", v: "Use " }, { t: "code", v: "a [b" }, { t: "text", v: " syntax" }]);
    expect(inline("Use `**")).toEqual([{ t: "text", v: "Use " }, { t: "code", v: "**" }]);
    expect(live("```\ncode **x and [y")).toEqual([{ type: "code", text: "code **x and [y" }]);
  });

  it("shows an unfinished link as its label, or as typed while the label is open", () => {
    expect(inline("see [the docs](https://x")).toEqual([{ t: "text", v: "see " }, { t: "text", v: "the docs" }]);
    expect(inline("see [**the** docs](")).toEqual([{ t: "text", v: "see " }, { t: "bold", v: "the" }, { t: "text", v: " docs" }]);
    expect(inline("see [the do")).toEqual([{ t: "text", v: "see [the do" }]);
    expect(inline('see [the docs](https://x.y "Docum')).toEqual([{ t: "text", v: "see " }, { t: "text", v: "the docs" }]);
  });

  it("hides a marker with nothing after it yet, outside code", () => {
    expect(inline("an opener: **")).toEqual([{ t: "text", v: "an opener: " }]);
    expect(inline("a `")).toEqual([{ t: "text", v: "a " }]);
    expect(inline("2 *")).toEqual([{ t: "text", v: "2 " }]);
  });

  it("does not take a closer or arithmetic for an opener", () => {
    expect(inline("これは*重要*です")).toEqual([{ t: "text", v: "これは" }, { t: "italic", v: "重要" }, { t: "text", v: "です" }]);
    for (const text of ["2 * 3", "2*3*4", "snake_case", "x*a*y"]) expect(flatten(live(text)).text).toBe(text + "\n");
  });

  it("only affects the last block", () => {
    expect(live("**stray\n\nthen **bo")).toEqual([
      { type: "p", inline: [{ t: "text", v: "**stray" }] },
      { type: "p", inline: [{ t: "text", v: "then " }, { t: "bold", v: "bo" }] },
    ]);
    expect(live("- one **x\n- two **th").at(-1).items).toEqual([[{ t: "text", v: "one **x" }], [{ t: "text", v: "two " }, { t: "bold", v: "th" }]]);
  });

  it("cuts a spoken reply at the reveal point only (no half surrogate pair)", () => {
    expect(revealPrefix("Use `**` here", 6)).toBe("Use `*");
    expect(inline(revealPrefix("Use `**` here", 6))).toEqual([{ t: "text", v: "Use " }, { t: "code", v: "*" }]);
    expect(inline(revealPrefix("a **b**", 3))).toEqual([{ t: "text", v: "a " }]);
    expect(revealPrefix("𠮷x", 1)).toBe("");
    expect(revealPrefix("abc", 9)).toBe("abc");
  });

  it("keeps every prefix of realistic replies consistent with the finished reply", () => {
    for (const reply of replies) {
      const final = flatten(parse(reply));
      expect(live(reply)).toEqual(parse(reply)); // a finished reply reads the same either way
      for (let n = 0; n <= reply.length; n++) {
        const prefix = revealPrefix(reply, n);
        let shown;
        expect(() => { shown = flatten(live(prefix)); }, `prefix ${n} of ${JSON.stringify(reply)}`).not.toThrow();
        const at = `prefix ${JSON.stringify(prefix)}`;
        // No marker shows that the finished reply does not show.
        expect(count(shown.text, "*"), at).toBeLessThanOrEqual(count(final.text, "*"));
        expect(count(shown.text, "`"), at).toBeLessThanOrEqual(count(final.text, "`"));
        expect(count(shown.text, "**"), at).toBeLessThanOrEqual(count(final.text, "**"));
        // Code is only ever cut short, never changed.
        expect(final.code.startsWith(shown.code.endsWith("\u0000") ? shown.code.slice(0, -1) : shown.code), at).toBe(true);
      }
    }
  });
});
