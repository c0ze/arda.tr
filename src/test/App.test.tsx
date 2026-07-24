import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "@/App";
import * as Catalog from "@/content/CatalogContent.res.mjs";

const entries = Catalog.entries as { cat: string; name: string; band: number; featured: boolean }[];
const kinds = Catalog.kinds as { band: number; name: string }[];

describe("App", () => {
  it("renders the catalogue masthead and the featured plate", () => {
    render(<App />);

    // Exactly one h1, and it names the document — the page had none before.
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/arda\s*\.tr/i);

    expect(screen.getByRole("button", { name: "Select rendition" })).toBeInTheDocument();
    // The featured entries lead the page at plate scale.
    expect(screen.getByRole("heading", { level: 3, name: "SUDONE" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Pagan" })).toBeInTheDocument();
    // The key is printed, so the band code is legible to a first-time visitor.
    expect(screen.getByRole("heading", { name: /Key — band code/ })).toBeInTheDocument();
  });

  it("gives every featured plate a working in-page anchor to its own row", () => {
    render(<App />);

    for (const e of entries.filter((x) => x.featured)) {
      const cite = screen.getByRole("link", { name: `See cat. ${e.cat} ↓` });
      expect(cite).toHaveAttribute("href", `#${e.cat.replace(/ /g, "-")}`);
      // ...and the target actually exists.
      expect(document.getElementById(e.cat.replace(/ /g, "-"))).not.toBeNull();
    }
  });

  it("lists every entry, of every kind, in one table", () => {
    render(<App />);

    // The thesis: one flat listing, no per-kind territories. Every catalogue
    // number must be present on first paint.
    for (const entry of entries) {
      expect(screen.getByText(entry.cat)).toBeInTheDocument();
    }
    expect(screen.getByText(`all ${entries.length} entries, every kind, one table`)).toBeInTheDocument();
  });

  it("pairs every band mark with its kind name for screen readers", () => {
    render(<App />);

    // Colour is never the sole signal — DESIGN.md, The One Band Rule.
    for (const kind of kinds) {
      const inKind = entries.filter((e) => e.band === kind.band).length;
      if (inKind > 0) {
        expect(screen.getAllByText(`Kind: ${kind.name}`).length).toBe(inKind);
      }
    }
  });

  it("clears an active filter when a featured plate cites its own row", () => {
    render(<App />);

    // Filter to Games, which unmounts SUDONE's row...
    const facet = screen
      .getAllByRole("button")
      .find((b) => /Band 3/.test(b.textContent ?? "") && /originals & ports/.test(b.textContent ?? ""));
    fireEvent.click(facet!);
    expect(screen.queryByText("AK 2-0142")).not.toBeInTheDocument();

    // ...then cite it from the featured strip. The anchor would point at a
    // node that is not in the DOM unless the citation clears the filter.
    fireEvent.click(screen.getByRole("link", { name: "See cat. AK 2-0142 ↓" }));
    expect(screen.getByText("AK 2-0142")).toBeInTheDocument();
    expect(document.getElementById("AK-2-0142")).not.toBeNull();
  });

  it("filters the listing by band and clears again", () => {
    render(<App />);

    // The facet row and the tab rail drive the same state; both expose a
    // button per band, so scope to the facet row's richer label.
    const facet = screen
      .getAllByRole("button")
      .find((b) => /Band 3/.test(b.textContent ?? "") && /originals & ports/.test(b.textContent ?? ""));
    expect(facet).toBeDefined();

    fireEvent.click(facet!);

    expect(screen.queryByText("AK 2-0142")).not.toBeInTheDocument();
    expect(screen.getByText("AK 3-0088")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear filter ×" }));
    expect(screen.getByText("AK 2-0142")).toBeInTheDocument();
  });
});
