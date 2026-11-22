import { afterEach, describe, expect, it } from "vitest";
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
const kinds = Catalog.kinds as { band: number; name: string; code: string }[];
const anchor = (cat: string) => cat.replace(/ /g, "-");
const listing = () => document.getElementById("catalogue-listing")!;
const pad2 = (n: number) => String(n).padStart(2, "0");
const filter = () => screen.getByRole("group", { name: "Filter by kind" });
const kindButton = (name: string) =>
  within(filter()).getByRole("button", { name: new RegExp(`^${name} \\d\\d$`) });

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

// The page holds every entry and Astryx's controls; jsdom's role queries over
// it are slow on a loaded machine, so these tests get more than the default 5 s.
describe("App", { timeout: 30_000 }, () => {
  it("names the page once, in the hero, under the bar", () => {
    render(<App />);

    // Exactly one h1, and it is the person the page is about.
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(/^Arda Karaduman$/);

    // The bar carries the wordmark, and the hero leads on to the works.
    expect(within(screen.getByRole("banner")).getByRole("img", { name: "arda.tr" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse works" })).toHaveAttribute("href", "#catalogue");
    // llms.txt deep-links these three sections.
    for (const id of ["catalogue", "record", "contact"]) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("lists every entry, of every kind, as a numbered row with its own heading and anchor", () => {
    render(<App />);

    // The thesis: one flat list. Every entry is present on first paint, and
    // its catalogue-number id survives so old deep links (#AK-2-0142) land.
    const titles = within(listing()).getAllByRole("heading", { level: 3 }).map((h) => h.textContent ?? "");
    entries.forEach((e, i) => {
      expect(titles[i].startsWith(e.name), e.name).toBe(true);
      const row = document.getElementById(anchor(e.cat));
      expect(row).not.toBeNull();
      expect(within(row!).getByRole("heading", { level: 3 })).toHaveTextContent(e.name);
      // The same line for everything: number, kind code, title.
      expect(row).toHaveTextContent(String(i + 1).padStart(3, "0"));
      expect(row).toHaveTextContent(kinds.find((k) => k.band === e.band)!.code);
    });
    expect(within(listing()).getAllByRole("listitem")).toHaveLength(entries.length);
  });

  it("links each entry to its site, and to its source when it has both", () => {
    render(<App />);

    for (const e of entries) {
      const row = document.getElementById(anchor(e.cat))!;
      const primary = e.href || e.repo;
      if (primary) {
        expect(within(row).getByRole("link", { name: e.name })).toHaveAttribute("href", primary);
      } else {
        expect(within(row).queryByRole("link", { name: e.name })).toBeNull();
      }
      const src = within(row).queryByRole("link", { name: `src: source for ${e.name}` });
      if (e.href && e.repo) expect(src).toHaveAttribute("href", e.repo);
      else expect(src).toBeNull();
    }
  });

  it("passes the referrer within the arda.tr family and withholds it elsewhere", () => {
    render(<App />);

    // Family sites (arda.tr, *.arda.tr) should see where a visitor came from;
    // other hosts get rel="noopener noreferrer". No entry opens a new tab.
    const family = (url: string) => /^(.+\.)?arda\.tr$/.test(new URL(url).hostname);
    let familyLinks = 0;
    for (const e of entries) {
      for (const a of document.getElementById(anchor(e.cat))!.querySelectorAll("a")) {
        const href = a.getAttribute("href")!;
        expect(a).not.toHaveAttribute("target");
        if (family(href)) {
          familyLinks++;
          expect(a, href).not.toHaveAttribute("rel");
        } else {
          expect(a, href).toHaveAttribute("rel", "noopener noreferrer");
        }
      }
    }
    expect(familyLinks).toBeGreaterThan(0);
  });

  it("marks featured entries in place instead of repeating them", () => {
    render(<App />);

    for (const e of entries) {
      const row = document.getElementById(anchor(e.cat))!;
      expect(within(row).queryByText("Featured") !== null).toBe(e.featured);
    }
  });

  it("filters the listing by kind, announces it, and clears again", () => {
    render(<App />);

    const games = kinds.find((k) => k.band === 3)!;
    const button = kindButton(games.name);
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    const inKind = entries.filter((e) => e.band === 3);
    expect(within(listing()).getAllByRole("listitem")).toHaveLength(inKind.length);
    expect(document.getElementById("AK-2-0142")).toBeNull();
    expect(document.getElementById("AK-3-0088")).not.toBeNull();
    // The status line is a live region, so the new count is announced.
    const status = screen.getByText(/Showing/).closest("[aria-live]");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent(`Showing ${pad2(inKind.length)} of ${entries.length}`);

    fireEvent.click(screen.getByRole("button", { name: "Clear filter" }));
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(within(listing()).getAllByRole("listitem")).toHaveLength(entries.length);
    expect(document.getElementById("AK-2-0142")).not.toBeNull();
  });

  it("toggles a kind off again, and All shows every kind", () => {
    render(<App />);

    const all = within(filter()).getByRole("button", { name: /^All \d\d$/ });
    expect(all).toHaveAttribute("aria-pressed", "true");
    const tools = kindButton(kinds.find((k) => k.band === 5)!.name);

    fireEvent.click(tools);
    expect(all).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(tools);
    expect(all).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(tools);
    fireEvent.click(all);
    expect(within(listing()).getAllByRole("listitem")).toHaveLength(entries.length);
  });

  it("shows the same entries as plates, with the same anchors and links", () => {
    render(<App />);

    // Rows and plates are two views of one list: switching the view must not
    // lose an entry, its number, its anchor or its link.
    fireEvent.click(within(screen.getByRole("group", { name: "View" })).getByRole("button", { name: "Plates" }));

    expect(within(listing()).getAllByRole("listitem")).toHaveLength(entries.length);
    entries.forEach((e, i) => {
      const plate = document.getElementById(anchor(e.cat))!;
      expect(plate).toHaveTextContent(String(i + 1).padStart(3, "0"));
      const primary = e.href || e.repo;
      if (primary) expect(within(plate).getByRole("link", { name: e.name })).toHaveAttribute("href", primary);
    });

    // The kind filter still applies to the plates.
    fireEvent.click(kindButton(kinds.find((k) => k.band === 3)!.name));
    expect(within(listing()).getAllByRole("listitem")).toHaveLength(entries.filter((e) => e.band === 3).length);
  });

  it("carries the family's one link to coze.org in contact, next to pagan", () => {
    render(<App />);

    // The arda.tr sites and the coze.org sites are two link families; only
    // the two landing pages link to each other (PRODUCT.md).
    const contact = document.getElementById("contact")!;
    const labels = Array.from(contact.querySelectorAll("dt")).map((dt) => dt.textContent);
    expect(labels[labels.indexOf("Pagan") + 1]).toBe("coze.org");
    const coze = within(contact).getByRole("link", { name: "coze.org" });
    expect(coze).toHaveAttribute("href", "https://coze.org");
    expect(coze).not.toHaveAttribute("rel");
    expect(document.querySelectorAll('a[href^="https://coze.org"]')).toHaveLength(1);
  });

  it("marks the bar's blog and résumé links as the same person (rel=me)", () => {
    render(<App />);

    const nav = screen.getByRole("navigation", { name: "Site" });
    const rel = (name: string) => within(nav).getByRole("link", { name }).getAttribute("rel");
    expect(rel("blog")).toBe("me");
    expect(rel("résumé")).toBe("me");
    // The others carry no rel at all, not an empty one.
    for (const name of ["works", "ask", "lind"]) expect(rel(name)).toBeNull();
  });

  it("opens the chat from the hero's ask button", () => {
    render(<App />);

    expect(screen.queryByRole("dialog", { name: "Ask about Arda" })).toBeNull();
    const hero = screen.getByRole("heading", { level: 1 }).closest("section")!;
    fireEvent.click(within(hero).getByRole("button", { name: "Ask about Arda" }));
    expect(screen.getByRole("dialog", { name: "Ask about Arda" })).toBeInTheDocument();
  });

  it("pins the other scheme from the bar, and unpins it on the way back", () => {
    render(<App />);

    // jsdom has no matchMedia dark preference, so the system scheme is light:
    // the switch offers dark, pins it on <html> and in storage, then clears
    // the pin when the visitor returns to what the system shows anyway.
    const nav = screen.getByRole("navigation", { name: "Site" });
    const toggle = within(nav).getByRole("button", { name: /Switch to/ });

    fireEvent.click(toggle);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");

    fireEvent.click(toggle);
    expect(document.documentElement).not.toHaveAttribute("data-theme");
    expect(window.localStorage.getItem("theme")).toBeNull();
  });
});
