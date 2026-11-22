import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { bootSnippet } from "../../brand/scheme.js";

// GitHub Pages serves public/404.html for any unknown path. It stands alone
// (no bundle), so it carries the brand's colours and the scheme script itself.
const html = readFileSync(path.resolve(__dirname, "../../public/404.html"), "utf8");
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1])[0];
const run = () => new Function(script)();

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  window.localStorage.clear();
});

describe("404 page", () => {
  it("is kept out of search results and links home with root-absolute URLs", () => {
    expect(html).toMatch(/<meta name="robots" content="noindex" \/>/);
    expect(html).toMatch(/<a [^>]*href="\/"/);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) expect(url.startsWith("/")).toBe(true);
  });

  it("follows the system scheme unless one is pinned, with the site's own script", () => {
    // The same snippet as index.html: a visitor who pinned dark on the site
    // must not land on a light 404.
    expect(script).toBe(bootSnippet("theme"));
    expect(html).toContain('<meta name="color-scheme" content="light dark" />');
    expect(html).toContain(':root[data-theme="dark"] { color-scheme: dark; }');

    run();
    expect(document.documentElement).not.toHaveAttribute("data-theme");
    window.localStorage.setItem("theme", "dark");
    run();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("ignores unknown ids and blocked storage", () => {
    window.localStorage.setItem("theme", "x onclick=alert(1)");
    run();
    expect(document.documentElement).not.toHaveAttribute("data-theme");
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(run).not.toThrow();
    spy.mockRestore();
  });
});
