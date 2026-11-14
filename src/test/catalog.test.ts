import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as Catalog from "@/content/CatalogContent.res.mjs";

type Entry = { cat: string; band: number; name: string; href: string; repo: string; image: string };
const entries = Catalog.entries as Entry[];
const publicDir = path.resolve(__dirname, "../../public");

describe("catalogue data", () => {
  it("points every image at a file that ships in public/", () => {
    // A missing file would leave a card on its seeded sigil without anyone noticing.
    for (const e of entries.filter((e) => e.image)) {
      expect(existsSync(path.join(publicDir, e.image)), `${e.name}: ${e.image}`).toBe(true);
    }
  });

  it("gives every entry its own catalogue number (the card's anchor id)", () => {
    const cats = entries.map((e) => e.cat);
    expect(new Set(cats).size).toBe(cats.length);
  });

  it("leads each band with its newest work", () => {
    // The listing reads top-down, newest first within a kind.
    const first = (band: number) => entries.find((e) => e.band === band)!;
    expect(first(2)).toMatchObject({ name: "Skrivist Books", href: "https://books.skriv.ist" });
    expect(first(3)).toMatchObject({ name: "King", href: "https://king.arda.tr" });
    expect(first(5)).toMatchObject({ name: "Armarium", href: "https://armarium.skriv.ist" });
  });

  it("no longer lists COMMIT!!!", () => {
    expect(entries.find((e) => e.name === "COMMIT!!!")).toBeUndefined();
  });
});
