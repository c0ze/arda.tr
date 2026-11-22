import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "@/App";
import * as Catalog from "@/content/CatalogContent.res.mjs";

const entries = Catalog.entries as {
  cat: string;
  name: string;
  category: string;
  group: string;
  href: string;
  repo: string;
}[];
const categories = Catalog.categories as { id: string; name: string }[];
const anchor = (cat: string) => cat.replace(/ /g, "-");
const block = (id: string) => document.getElementById(`works-${id}`) as HTMLDetailsElement;

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
    expect(h1s[0]).toHaveTextContent(/^Arda\s*Karaduman$/);

    // The bar carries the wordmark.
    expect(within(screen.getByRole("banner")).getByRole("img", { name: "arda.tr" })).toBeInTheDocument();
    // llms.txt deep-links these three sections.
    for (const id of ["catalogue", "record", "contact"]) {
      expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("lists the works under the five categories, each a block that opens", () => {
    render(<App />);

    // The categories Arda named, in his order, numbered I to V.
    expect(categories.map((c) => c.name)).toEqual(["coze", "gand", "gand.games", "music", "github"]);
    const blocks = Array.from(document.querySelectorAll("#catalogue details"));
    expect(blocks.map((d) => d.id)).toEqual(categories.map((c) => `works-${c.id}`));
    expect(blocks.map((d) => d.querySelector("summary")!.textContent)).toEqual(
      categories.map((c, i) => expect.stringContaining(`${["I", "II", "III", "IV", "V"][i]}${c.name}`)),
    );
    // Open on arrival: the first one only. They are native <details>, so the
    // rest open without script, and no heading sits inside a <summary>
    // (screen readers would drop it).
    expect(blocks.map((d) => (d as HTMLDetailsElement).open)).toEqual([true, false, false, false, false]);
    expect(document.querySelector("#catalogue summary :is(h1, h2, h3, h4)")).toBeNull();
  });

  it("keeps every entry in its category, with its anchor, whether the block is open or not", () => {
    render(<App />);

    // Old deep links (#AK-2-0142) must land: each entry keeps its id, inside
    // the block of its category.
    for (const e of entries) {
      const el = document.getElementById(anchor(e.cat));
      expect(el, e.name).not.toBeNull();
      expect(block(e.category).contains(el), e.name).toBe(true);
      expect(el).toHaveTextContent(e.name);
    }
    for (const c of categories) expect(entries.some((e) => e.category === c.id), c.name).toBe(true);
  });

  it("links each entry to its site, and to its source when it has both", () => {
    render(<App />);

    for (const e of entries) {
      const el = document.getElementById(anchor(e.cat))!;
      const primary = e.href || e.repo;
      const link = Array.from(el.querySelectorAll("a")).find((a) => a.textContent === e.name);
      if (primary) expect(link, e.name).toHaveAttribute("href", primary);
      else expect(link).toBeUndefined();
      // Grouped entries (coze's games) share a line and show names only.
      if (e.group) continue;
      const src = Array.from(el.querySelectorAll("a")).find(
        (a) => a.getAttribute("aria-label") === `source: source for ${e.name}`,
      );
      if (e.href && e.repo) expect(src, e.name).toHaveAttribute("href", e.repo);
      else expect(src).toBeUndefined();
    }
  });

  it("passes the referrer within the arda.tr family and withholds it elsewhere", () => {
    render(<App />);

    // Family sites (arda.tr, *.arda.tr) should see where a visitor came from;
    // other hosts get rel="noopener noreferrer". No entry opens a new tab.
    const family = (url: string) => /^(.+\.)?arda\.tr$/.test(new URL(url).hostname);
    let familyLinks = 0;
    for (const a of document.querySelectorAll("#catalogue a")) {
      const href = a.getAttribute("href")!;
      expect(a).not.toHaveAttribute("target");
      if (family(href)) {
        familyLinks++;
        expect(a, href).not.toHaveAttribute("rel");
      } else {
        expect(a, href).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
    expect(familyLinks).toBeGreaterThan(0);
  });

  it("gathers coze's games on one line under their group", () => {
    render(<App />);

    const games = entries.filter((e) => e.category === "coze" && e.group === "games");
    expect(games.length).toBeGreaterThan(1);
    const line = document.getElementById(anchor(games[0].cat))!.closest("li")!;
    expect(within(line).getByRole("heading", { level: 3 })).toHaveTextContent("games");
    for (const g of games) expect(line).toContainElement(document.getElementById(anchor(g.cat)));
  });

  it("carries the family's one link to coze.org in contact, next to pagan", () => {
    render(<App />);

    // The arda.tr sites and the coze.org sites are two link families; only
    // the two landing pages link to each other (PRODUCT.md).
    const contact = document.getElementById("contact")!;
    const items = within(contact).getAllByRole("listitem").map((li) => li.textContent);
    expect(items[items.indexOf("Pagan") + 1]).toBe("coze.org");
    const coze = within(contact).getByRole("link", { name: "coze.org" });
    expect(coze).toHaveAttribute("href", "https://coze.org");
    expect(coze).not.toHaveAttribute("rel");
    expect(document.querySelectorAll('a[href="https://coze.org"]')).toHaveLength(1);
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

  it("opens the chat from contact's ask button", () => {
    render(<App />);

    expect(screen.queryByRole("dialog", { name: "Ask about Arda" })).toBeNull();
    fireEvent.click(within(document.getElementById("contact")!).getByRole("button", { name: "Ask the assistant" }));
    expect(screen.getByRole("dialog", { name: "Ask about Arda" })).toBeInTheDocument();
  });

  it("is dark unless the visitor pins light, and unpins on the way back", () => {
    render(<App />);

    // The page's own scheme is dark. The switch offers light, pins it on
    // <html> and in storage, then clears the pin when the visitor returns to
    // dark, which the page shows anyway.
    const nav = screen.getByRole("navigation", { name: "Site" });
    const toggle = within(nav).getByRole("button", { name: /Switch to/ });

    fireEvent.click(toggle);
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(window.localStorage.getItem("theme")).toBe("light");

    fireEvent.click(toggle);
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem("theme")).toBeNull();
  });
});
