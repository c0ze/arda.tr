import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "@/App";
import * as Catalog from "@/content/CatalogContent.res.mjs";

const entries = Catalog.entries as {
  cat: string;
  name: string;
  band: number;
  featured: boolean;
  href: string;
  repo: string;
}[];
const kinds = Catalog.kinds as { band: number; name: string }[];
const anchor = (cat: string) => cat.replace(/ /g, "-");
const listing = () => document.getElementById("catalogue-listing")!;
const kindButton = (name: string) => screen.getByRole("button", { name: new RegExp(`^${name.toLowerCase()}/ \\d\\d$`) });

describe("App", () => {
  it("names the page once, in the hero, with the status bar around it", () => {
    render(<App />);

    // Exactly one h1, and it is the person the page is about.
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/Arda\s+Karaduman/);

    expect(screen.getByRole("button", { name: "Select rendition" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ls ~/works ↓" })).toHaveAttribute("href", "#catalogue");
    // llms.txt deep-links these three sections.
    for (const id of ["catalogue", "record", "contact"]) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("lists every entry, of every kind, as a card with its own heading and anchor", () => {
    render(<App />);

    // The thesis: one flat listing. Every entry is present on first paint, and
    // its catalogue-number id survives so old deep links (#AK-2-0142) land.
    for (const e of entries) {
      expect(screen.getByRole("heading", { level: 3, name: e.name })).toBeInTheDocument();
      const card = document.getElementById(anchor(e.cat));
      expect(card).not.toBeNull();
      expect(within(card!).getByRole("heading", { level: 3 })).toHaveTextContent(e.name);
    }
    expect(within(listing()).getAllByRole("article")).toHaveLength(entries.length);
  });

  it("links each card to its site, and to its source when it has both", () => {
    render(<App />);

    for (const e of entries) {
      const card = document.getElementById(anchor(e.cat))!;
      const primary = e.href || e.repo;
      if (primary) {
        expect(within(card).getByRole("link", { name: e.name })).toHaveAttribute("href", primary);
      } else {
        expect(within(card).queryByRole("link", { name: e.name })).toBeNull();
      }
      const src = within(card).queryByRole("link", { name: `Source for ${e.name}` });
      if (e.href && e.repo) expect(src).toHaveAttribute("href", e.repo);
      else expect(src).toBeNull();
    }
  });

  it("marks featured entries in place instead of repeating them", () => {
    render(<App />);

    for (const e of entries) {
      const card = document.getElementById(anchor(e.cat))!;
      expect(within(card).queryByText("featured") !== null).toBe(e.featured);
    }
  });

  it("filters the listing by kind, announces it, and clears again", () => {
    render(<App />);

    const games = kinds.find((k) => k.band === 3)!;
    const button = kindButton(games.name);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAttribute("aria-controls", "catalogue-listing");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    const inKind = entries.filter((e) => e.band === 3);
    expect(within(listing()).getAllByRole("article")).toHaveLength(inKind.length);
    expect(document.getElementById("AK-2-0142")).toBeNull();
    expect(document.getElementById("AK-3-0088")).not.toBeNull();
    // The status line is a live region, so the new count is announced.
    const status = screen.getByText(/showing/).closest("[aria-live]");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent(`showing ${String(inKind.length).padStart(2, "0")} of ${entries.length}`);

    fireEvent.click(screen.getByRole("button", { name: "clear filter" }));
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(within(listing()).getAllByRole("article")).toHaveLength(entries.length);
    expect(document.getElementById("AK-2-0142")).not.toBeNull();
  });

  it("toggles a kind off again, and `*` shows every kind", () => {
    render(<App />);

    const all = screen.getByRole("button", { name: /all kinds/ });
    expect(all).toHaveAttribute("aria-pressed", "true");
    const tools = kindButton(kinds.find((k) => k.band === 5)!.name);

    fireEvent.click(tools);
    expect(all).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(tools);
    expect(all).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(tools);
    fireEvent.click(all);
    expect(within(listing()).getAllByRole("article")).toHaveLength(entries.length);
  });

  it("opens the chat from the hero's ask button", () => {
    render(<App />);

    expect(screen.queryByRole("dialog", { name: "Ask about Arda" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Ask Arda's AI" }));
    expect(screen.getByRole("dialog", { name: "Ask about Arda" })).toBeInTheDocument();
  });
});
