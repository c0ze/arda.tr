import { afterEach, describe, expect, it } from "vitest";
import { html } from "./indexHtmlSource";
import { SCHEME_EVENT, bootSnippet, normalize, readScheme, toggleScheme } from "../../brand/scheme.js";

// brand/scheme.js is the family's scheme switch (the sibling sites carry
// copies). The page follows the system unless the visitor pins a scheme.
const root = document.documentElement;
const runBoot = (key: string, fallback: "dark" | null = null) => new Function(bootSnippet(key, fallback))();

afterEach(() => {
  root.removeAttribute("data-theme");
  window.localStorage.clear();
});

describe("scheme switch", () => {
  it("is applied before first paint by the script in index.html's head", () => {
    // The inline script must be the generated one, right after the meta it
    // rewrites, and ahead of the bundle.
    const snippet = `<script>${bootSnippet("theme")}</script>`;
    expect(html).toContain(snippet);
    expect(html.indexOf('<meta name="color-scheme" content="light dark" />')).toBeLessThan(html.indexOf(snippet));
    expect(html.indexOf(snippet)).toBeLessThan(html.indexOf('type="module"'));
  });

  it("keeps the choice of visitors who picked a rendition in an earlier design", () => {
    // One Bit Forest stored night / night-hc / xerox / xerox-hc; older systems
    // stored other ids. They map to the scheme of the same role.
    expect(normalize("night-hc")).toBe("dark");
    expect(normalize("carbon")).toBe("dark");
    expect(normalize("xerox")).toBe("light");
    expect(normalize("paper")).toBe("light");
    expect(normalize("x onclick=alert(1)")).toBeNull();

    window.localStorage.setItem("theme", "night");
    runBoot("theme");
    expect(root).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem("theme")).toBe("dark");

    window.localStorage.setItem("theme", "no-such-id");
    root.removeAttribute("data-theme");
    runBoot("theme");
    expect(root).not.toHaveAttribute("data-theme");
    expect(window.localStorage.getItem("theme")).toBeNull();
  });

  it("pins only a scheme that differs from what the page would show anyway", () => {
    // jsdom's system scheme is light (setup.ts: matchMedia never matches).
    expect(toggleScheme("theme")).toBe("dark");
    expect(readScheme("theme")).toBe("dark");
    expect(root).toHaveAttribute("data-theme", "dark");

    // Back to light: that is the system's scheme, so the pin is removed and
    // the page follows the system again.
    expect(toggleScheme("theme")).toBe("light");
    expect(readScheme("theme")).toBeNull();
    expect(root).not.toHaveAttribute("data-theme");
  });

  it("supports a site that is dark unless pinned (ai.arda.tr)", () => {
    runBoot("theme", "dark");
    expect(root).toHaveAttribute("data-theme", "dark");

    expect(toggleScheme("theme", "dark")).toBe("light");
    expect(readScheme("theme")).toBe("light");
    expect(root).toHaveAttribute("data-theme", "light");

    expect(toggleScheme("theme", "dark")).toBe("dark");
    expect(readScheme("theme")).toBeNull();
    expect(root).toHaveAttribute("data-theme", "dark");
  });

  it("announces each change, so a framework that owns <html data-theme> can follow", () => {
    const seen: unknown[] = [];
    const listen = (event: Event) => seen.push((event as CustomEvent).detail);
    document.addEventListener(SCHEME_EVENT, listen);
    toggleScheme("theme");
    toggleScheme("theme");
    document.removeEventListener(SCHEME_EVENT, listen);
    expect(seen).toEqual(["dark", null]);
  });
});
