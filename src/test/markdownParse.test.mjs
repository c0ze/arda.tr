import { describe, expect, it } from "vitest";
import { parse, plainText, revealPrefix } from "../components/markdownParse.mjs";

// Chat replies talk about code, so identifiers, URLs and arithmetic must come
// through as written; only deliberate emphasis turns into <em>.
const inline = (text) => parse(text)[0].inline;
const plain = (text) => expect(inline(text)).toEqual([{ t: "text", v: text }]);

describe("chat markdown emphasis", () => {
  it("keeps snake_case identifiers and URLs with underscores as text", () => {
    plain("rust_on_rails");
    plain("see https://github.com/c0ze/some_repo_name for the source");
    plain("MAX_RETRY_COUNT and __init__");
  });

  it("treats letters outside the BMP as letters next to a marker", () => {
    plain("𠮷_name_");
    plain("_name_𠮷");
    plain("𝑥_value_");
  });

  it("keeps arithmetic and stray asterisks as text", () => {
    plain("2 * 3 * 4 = 24");
    plain("2*3*4 = 24");
    plain("a * b and c _ d _ e");
  });

  it("still renders deliberate emphasis", () => {
    expect(inline("an *italic* word")).toEqual([
      { t: "text", v: "an " },
      { t: "italic", v: "italic" },
      { t: "text", v: " word" },
    ]);
    expect(inline("_also italic_, then (*this*).")).toEqual([
      { t: "italic", v: "also italic" },
      { t: "text", v: ", then (" },
      { t: "italic", v: "this" },
      { t: "text", v: ")." },
    ]);
    expect(inline("**bold** and `co_de_` and [a_b](https://x.y/a_b_c)")).toEqual([
      { t: "bold", v: "bold" },
      { t: "text", v: " and " },
      { t: "code", v: "co_de_" },
      { t: "text", v: " and " },
      { t: "link", v: "a_b", href: "https://x.y/a_b_c" },
    ]);
  });

  it("finds emphasis after a rejected candidate", () => {
    expect(inline("snake_case and _real_")).toEqual([
      { t: "text", v: "snake_case and " },
      { t: "italic", v: "real" },
    ]);
  });

  // Japanese has no spaces, so the word-boundary rule for "*" counts only ASCII
  // letters and digits (as CommonMark does); "_" keeps the full Unicode rule.
  it("renders *emphasis* inside Japanese text", () => {
    expect(inline("これは*重要*です")).toEqual([
      { t: "text", v: "これは" },
      { t: "italic", v: "重要" },
      { t: "text", v: "です" },
    ]);
    expect(inline("漢字**太字**と*斜体*。")).toEqual([
      { t: "text", v: "漢字" },
      { t: "bold", v: "太字" },
      { t: "text", v: "と" },
      { t: "italic", v: "斜体" },
      { t: "text", v: "。" },
    ]);
    expect(inline("𠮷*強調*𠮷")).toEqual([
      { t: "text", v: "𠮷" },
      { t: "italic", v: "強調" },
      { t: "text", v: "𠮷" },
    ]);
  });

  it("keeps _ inside Japanese words as text", () => {
    plain("これは_重要_です");
    plain("ファイル_名_");
  });

  // Models often wrap a link in bold or bold its label: one level of nesting.
  it("tokenizes the inside of bold, italic and link labels", () => {
    expect(inline("see **[golem](https://x.y)** now")).toEqual([
      { t: "text", v: "see " },
      { t: "bold", v: "[golem](https://x.y)", c: [{ t: "link", v: "golem", href: "https://x.y" }] },
      { t: "text", v: " now" },
    ]);
    expect(inline("[**label**](https://x.y)")).toEqual([
      { t: "link", v: "**label**", href: "https://x.y", c: [{ t: "bold", v: "label" }] },
    ]);
    expect(inline("*an `api` call*")).toEqual([
      { t: "italic", v: "an `api` call", c: [{ t: "text", v: "an " }, { t: "code", v: "api" }, { t: "text", v: " call" }] },
    ]);
  });

  it("nests one level only", () => {
    expect(inline("**a *b `c`* d**")).toEqual([
      {
        t: "bold",
        v: "a *b `c`* d",
        c: [{ t: "text", v: "a " }, { t: "italic", v: "b `c`" }, { t: "text", v: " d" }],
      },
    ]);
  });

  it("lets italic hold bold", () => {
    expect(inline("so *a **b** c* then")).toEqual([
      { t: "text", v: "so " },
      { t: "italic", v: "a **b** c", c: [{ t: "text", v: "a " }, { t: "bold", v: "b" }, { t: "text", v: " c" }] },
      { t: "text", v: " then" },
    ]);
    expect(inline("*__x__ **b***")[0]).toMatchObject({ t: "italic", v: "__x__ **b**" });
    expect(plainText("*a **b** c*")).toBe("a b c");
    // The ASCII boundary rule still applies to the italic's own markers.
    for (const text of ["x*a **b** c*y", "2 * 3 **x** 4 * 5"]) {
      expect(inline(text).map((t) => t.t)).toEqual(["text", "bold", "text"]);
    }
  });

  it("accepts a quoted link title and ignores it", () => {
    for (const title of ['"Documentation"', "'Documentation'", '"a (b) \'c\'"']) {
      expect(inline(`[Docs](https://example.com ${title}) here`)).toEqual([
        { t: "link", v: "Docs", href: "https://example.com" },
        { t: "text", v: " here" },
      ]);
    }
    // Still only http(s)/mailto hrefs render as links (Markdown.res), and the
    // title is never emitted.
    expect(inline('[x](javascript:alert(1) "t")')[0]).toEqual({ t: "link", v: "x", href: "javascript:alert(1)" });
    plain('[Docs](https://example.com "unterminated)');
  });

  it("keeps one balanced pair of parentheses in a link URL", () => {
    expect(inline("[Foo](https://en.wikipedia.org/wiki/Foo_(bar)) here")).toEqual([
      { t: "link", v: "Foo", href: "https://en.wikipedia.org/wiki/Foo_(bar)" },
      { t: "text", v: " here" },
    ]);
  });

  it("returns only plain data: markup in the reply stays text", () => {
    expect(inline("<img src=x onerror=alert(1)> *<b>x</b>*")).toEqual([
      { t: "text", v: "<img src=x onerror=alert(1)> " },
      { t: "italic", v: "<b>x</b>" },
    ]);
  });
});

// Streaming re-parses the whole reply on every chunk, so parsing must stay
// linear on hostile or broken input. Each case is 200,000 characters: linear
// parsing takes a few milliseconds, a quadratic scan several seconds.
describe("chat markdown on adversarial input", () => {
  const N = 200_000;
  const cases = {
    "open brackets": "[".repeat(N),
    "bold around open brackets": "**" + "[".repeat(N) + "**",
    "unclosed link targets": "[a](".repeat(N / 4),
    "parens after a label": "[a]" + "(".repeat(N),
    "parens inside a link target": "[a](" + "(x".repeat(N / 2),
    "label then brackets": "[a](" + "x[".repeat(N / 2),
    "unfinished link targets": "[a](".repeat(N / 4) + ")!",
    "closed labels": "](".repeat(N / 2),
    "unclosed titles": '[a](u "'.repeat(N / 7),
    "spaces before a title": "[a](u" + " ".repeat(N),
    asterisks: "*".repeat(N),
    "word asterisks": "x*".repeat(N / 2),
    "spaced asterisks": "* a ".repeat(N / 4),
    underscores: "_".repeat(N),
    "word underscores": "a_".repeat(N / 2),
    backticks: "`".repeat(N),
    "unclosed italic over bold": "*a " + "**b** ".repeat(N / 6),
    "rejected italics over bold": ("x*a **b** c*y ").repeat(N / 14),
  };
  for (const [name, text] of Object.entries(cases)) {
    it(`parses ${name} in linear time`, () => {
      const t0 = performance.now();
      parse(text);
      plainText(text);
      parse(text, { live: true });
      parse(revealPrefix(text, text.length >> 1), { live: true });
      expect(performance.now() - t0).toBeLessThan(1000);
    });
  }
});
