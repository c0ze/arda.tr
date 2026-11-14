import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import App from "@/App";
import { runTakeoverScript } from "./indexHtmlSource";

// The browser's own jump to the URL's fragment happens on the prerendered
// markup (or finds nothing under `npm run dev`); createRoot then replaces that
// markup and the canvases settle. llms.txt and old links point at #record,
// #contact, #catalogue and card ids such as #AK-5-0158, so the app lands them
// again itself, instantly (not a smooth glide from the top).

let landed: { id: string; options: unknown }[];
let resize: (() => void)[];

beforeEach(() => {
  landed = [];
  resize = [];
  // jsdom implements neither scrollIntoView nor ResizeObserver.
  Element.prototype.scrollIntoView = function (this: Element, options?: unknown) {
    landed.push({ id: this.id, options });
  } as Element["scrollIntoView"];
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(cb: () => void) {
        resize.push(cb);
      }
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  delete document.documentElement.dataset.takeover;
  window.history.replaceState(null, "", "/");
  vi.unstubAllGlobals();
});

const go = (hash: string) => window.history.replaceState(null, "", `/${hash}`);

describe("deep links", () => {
  it.each(["#record", "#contact", "#catalogue", "#AK-5-0158"])("lands %s on first load, instantly", (hash) => {
    go(hash);
    render(<App />);

    expect(landed.length).toBeGreaterThan(0);
    expect(landed.at(-1)).toEqual({ id: hash.slice(1), options: { block: "start", behavior: "instant" } });
  });

  it("decodes a percent-encoded fragment", () => {
    go("#%41K-5-0158"); // %41 = "A"
    render(<App />);
    expect(landed.at(-1)?.id).toBe("AK-5-0158");
  });

  it("does not throw on a malformed encoding or a fragment that names nothing", () => {
    go("#%E0%A4%A");
    expect(() => render(<App />)).not.toThrow();
    go("#nowhere");
    expect(() => render(<App />)).not.toThrow();
    expect(landed).toHaveLength(0);
  });

  it("stays on target through late layout shifts, until the visitor scrolls", () => {
    go("#record");
    render(<App />);
    const before = landed.length;

    // Canvases, images and web fonts settle after mount and push the target down.
    resize.forEach((cb) => cb());
    expect(landed.length).toBeGreaterThan(before);

    // Once the visitor takes over, a later shift must not yank them back.
    window.dispatchEvent(new Event("wheel"));
    const after = landed.length;
    resize.forEach((cb) => cb());
    expect(landed.length).toBe(after);
  });

  it("still lands after a slow mount when the visitor has not touched the page", () => {
    // index.html's head script runs first; the bundle arrives later.
    runTakeoverScript();
    go("#AK-5-0158");
    render(<App />);
    expect(landed.at(-1)?.id).toBe("AK-5-0158");
  });

  it("leaves a visitor who scrolled before the app mounted where they are", () => {
    // Prerendered: the browser jumped to #record, the visitor read on and
    // scrolled elsewhere, and only then did the bundle mount.
    runTakeoverScript();
    go("#record");
    window.dispatchEvent(new Event("wheel"));
    render(<App />);
    resize.forEach((cb) => cb());
    window.dispatchEvent(new Event("load"));
    expect(landed).toHaveLength(0);
  });

  it("does nothing without a fragment", () => {
    render(<App />);
    expect(landed).toHaveLength(0);
  });
});
