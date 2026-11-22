// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "@/entry-server";
import * as Catalog from "@/content/CatalogContent.res.mjs";
import { injectAppHtml, ssrServerOptions } from "../../scripts/prerender.mjs";

// The build prerenders the page into dist/index.html so that crawlers and
// readers without JavaScript get the text and the links. This runs in Node,
// as the build does: no window, no document.
const entries = Catalog.entries as { cat: string }[];

describe("prerendered page", () => {
  const html = render();

  it("carries the name, the family links, coze.org and every entry", () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toMatch(/<h1[^>]*>[\s\S]*Arda[\s\S]*Karaduman[\s\S]*<\/h1>/);
    for (const site of ["blog", "resume", "ai", "lind"]) {
      expect(html).toContain(`href="https://${site}.arda.tr"`);
    }
    expect(html).toContain('href="https://coze.org"');
    // Five category blocks, the first open; every entry is in the markup with
    // its deep-link id, open block or not.
    expect(html.match(/<details /g)).toHaveLength(5);
    expect(html.match(/<details [^>]*open=""/g)).toHaveLength(1);
    for (const e of entries) expect(html).toContain(`id="${e.cat.replace(/ /g, "-")}"`);
    for (const id of ["catalogue", "record", "contact"]) expect(html).toContain(`id="${id}"`);
  });

  it("names no past employer: the employment history is the résumé's", () => {
    for (const employer of ["Gaussy", "Robotfund", "Mobilous"]) expect(html).not.toContain(employer);
    expect(html).toContain("Veltra");
  });

  it("is the same on every build: nothing of the moment or the visitor baked in", () => {
    expect(html).not.toMatch(/\d\d:\d\d:\d\d/);
    // The site's own scheme (dark), never a visitor's pin: the head script
    // and the client apply that.
    expect(html).not.toMatch(/data-theme="light"/);
    expect(render()).toBe(html);
  });
});

describe("injectAppHtml", () => {
  const template = '<body><div id="root"></div><script></script></body>';

  it("puts the markup inside the root, taking $ patterns literally", () => {
    const app = "<p>$& and $1 and $$ and $'</p>";
    expect(injectAppHtml(template, app)).toBe(`<body><div id="root">${app}</div><script></script></body>`);
  });

  it("fails when the placeholder is missing", () => {
    expect(() => injectAppHtml("<body><div id=root></div></body>", "<p>x</p>")).toThrow(/placeholder/);
  });
});

describe("the prerender's Vite server", () => {
  it("opens no socket and watches nothing: it renders once and closes", () => {
    // A WebSocket on 24678 could clash with a running `npm run dev` or
    // another build on the shared CI runner.
    expect(ssrServerOptions).toMatchObject({ middlewareMode: true, hmr: false, ws: false, watch: null });
  });
});
