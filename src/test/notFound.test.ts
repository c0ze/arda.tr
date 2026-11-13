import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

// GitHub Pages serves public/404.html for any unknown path. It stands alone
// (no bundle), so it carries its own copy of the rendition switch-over.
const html = readFileSync(path.resolve(__dirname, "../../public/404.html"), "utf8");
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1])[0];
const run = () => new Function(script)();

afterEach(() => {
  document.documentElement.className = "";
  window.localStorage.clear();
});

describe("404 page", () => {
  it("is kept out of search results and links home with root-absolute URLs", () => {
    expect(html).toMatch(/<meta name="robots" content="noindex" \/>/);
    expect(html).toMatch(/<a [^>]*href="\/"/);
    for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) expect(url.startsWith("/")).toBe(true);
  });

  it("defines all four renditions and shows the stored one", () => {
    for (const id of ["night", "night-hc", "xerox", "xerox-hc"]) {
      expect(html).toContain(`.${id} {`);
      window.localStorage.setItem("theme", id);
      run();
      expect(document.documentElement.className).toBe(id);
    }
  });

  it("sets theme-color to the stored rendition's ground", () => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#060708";
    document.head.append(meta);
    const grounds = { night: "#060708", "night-hc": "#000000", xerox: "#efede6", "xerox-hc": "#ffffff" };
    for (const [id, ground] of Object.entries(grounds)) {
      window.localStorage.setItem("theme", id);
      run();
      expect(meta.content).toBe(ground);
    }
    meta.remove();
  });

  it("ignores unknown ids and blocked storage", () => {
    window.localStorage.setItem("theme", "x onclick=alert(1)");
    run();
    expect(document.documentElement.className).toBe("");
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(run).not.toThrow();
    spy.mockRestore();
  });
});
