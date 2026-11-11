import { describe, expect, it } from "vitest";
import { parse } from "../components/markdownParse.mjs";

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

  it("returns only plain data: markup in the reply stays text", () => {
    expect(inline("<img src=x onerror=alert(1)> *<b>x</b>*")).toEqual([
      { t: "text", v: "<img src=x onerror=alert(1)> " },
      { t: "italic", v: "<b>x</b>" },
    ]);
  });
});
