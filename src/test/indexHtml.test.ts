import { afterEach, describe, expect, it } from "vitest";
import { html, runTakeoverScript, takeoverScript } from "./indexHtmlSource";

// The head of index.html is what search engines and link previews read.
const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)![1];

type Node = Record<string, unknown> & { "@id"?: string; "@type"?: string };
const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);

describe("index.html structured data", () => {
  it("is one valid JSON-LD graph: the site, this profile page, and the person", () => {
    expect(ldBlocks).toHaveLength(1);
    const ld = JSON.parse(ldBlocks[0]) as { "@context": string; "@graph": Node[] };
    expect(ld["@context"]).toBe("https://schema.org");
    const byId = Object.fromEntries(ld["@graph"].map((n) => [n["@id"], n]));
    const website = byId[`${canonical}#website`];
    const page = byId[`${canonical}#webpage`];
    const person = byId[`${canonical}#person`];

    expect(website).toMatchObject({ "@type": "WebSite", name: "Arda Karaduman", url: canonical, inLanguage: "en" });
    expect(website.publisher).toEqual({ "@id": `${canonical}#person` });
    expect(page).toMatchObject({ "@type": "ProfilePage", url: canonical });
    expect(page.isPartOf).toEqual({ "@id": `${canonical}#website` });
    expect(page.mainEntity).toEqual({ "@id": `${canonical}#person` });

    // The person's url is the canonical URL, trailing slash and all.
    expect(canonical).toBe("https://arda.tr/");
    expect(person).toMatchObject({ "@type": "Person", name: "Arda Karaduman", url: canonical });
    for (const key of ["jobTitle", "worksFor", "alumniOf", "knowsAbout", "nationality", "address"]) {
      expect(person, key).toHaveProperty(key);
    }
    // og-image.jpg is a title card, not a picture of the person; Google's
    // ProfilePage guidance is to leave image out when there is no real one.
    expect(person).not.toHaveProperty("image");
  });

  it("ties the person to the family sites and the profiles", () => {
    const ld = JSON.parse(ldBlocks[0]) as { "@graph": Node[] };
    const person = ld["@graph"].find((n) => n["@type"] === "Person")!;
    const sameAs = person.sameAs as string[];
    for (const url of [
      "https://resume.arda.tr/",
      "https://blog.arda.tr",
      "https://github.com/c0ze",
      "https://www.linkedin.com/in/ardakaraduman/",
      "https://mastodon.world/@arda",
      "https://bsky.app/profile/arda-karaduman.bsky.social",
    ]) {
      expect(sameAs).toContain(url);
    }
    expect(new Set(sameAs).size).toBe(sameAs.length);
  });

  it("carries no keywords meta (search engines ignore it)", () => {
    expect(html).not.toMatch(/<meta name="keywords"/);
  });
});

// The prerendered page can be read and scrolled before the bundle loads. An
// inline script notes the visitor's first scroll, tap or key press, so the
// app's deep-link landing (src/lib/deepLink.ts) does not pull them back.
describe("index.html pre-mount takeover", () => {
  afterEach(() => {
    delete document.documentElement.dataset.takeover;
  });

  it("sits in the head, before the app's bundle", () => {
    expect(takeoverScript).toBeDefined();
    expect(html.indexOf(takeoverScript!)).toBeLessThan(html.indexOf("</head>"));
  });

  it.each(["wheel", "touchmove", "keydown", "pointerdown"])("marks the page as taken over on %s", (type) => {
    runTakeoverScript();
    expect(document.documentElement.dataset.takeover).toBeUndefined();
    window.dispatchEvent(new Event(type));
    expect(document.documentElement.dataset.takeover).toBe("1");
  });
});
