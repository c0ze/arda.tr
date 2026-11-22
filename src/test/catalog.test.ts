import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as Catalog from "@/content/CatalogContent.res.mjs";

type Entry = { cat: string; category: string; group: string; name: string; href: string; repo: string; image: string };
const entries = Catalog.entries as Entry[];
const categories = Catalog.categories as { id: string; name: string; note: string }[];
const publicDir = path.resolve(__dirname, "../../public");

describe("catalogue data", () => {
  it("files every entry under one of the five categories", () => {
    const ids = categories.map((c) => c.id);
    expect(ids).toEqual(["coze", "gand", "gand-games", "music", "github"]);
    for (const e of entries) expect(ids, e.name).toContain(e.category);
  });

  it("points every image at a file that ships in public/", () => {
    for (const e of entries.filter((e) => e.image)) {
      expect(existsSync(path.join(publicDir, e.image)), `${e.name}: ${e.image}`).toBe(true);
    }
  });

  it("gives every entry its own catalogue number (its anchor id)", () => {
    const cats = entries.map((e) => e.cat);
    expect(new Set(cats).size).toBe(cats.length);
  });

  it("leads each category with the works Arda named first", () => {
    const first = (id: string) => entries.find((e) => e.category === id)!;
    expect(first("coze")).toMatchObject({ name: "dergi.coze.org" });
    expect(first("gand")).toMatchObject({ name: "Skriv.ist", href: "https://skriv.ist" });
    expect(first("gand-games")).toMatchObject({ name: "Gand Games", href: "https://gand.games" });
    expect(first("music")).toMatchObject({ name: "Pagan", href: "https://pagan.tr" });
    expect(first("github")).toMatchObject({ name: "tincan" });
  });

  it("no longer lists COMMIT!!!", () => {
    expect(entries.find((e) => e.name === "COMMIT!!!")).toBeUndefined();
  });
});
