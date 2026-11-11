import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

// The canvases read their palette from the <html> class. Under
// prefers-reduced-motion onebit.js paints exactly one frame and never another,
// so the first frame must already be in the stored rendition, and a rendition
// switch must repaint every canvas.

const fx = vi.hoisted(() => {
  const handle = () => ({ redraw: vi.fn(), destroy: vi.fn(), summon: vi.fn(), sizzle: vi.fn(), reduced: true });
  return {
    forest: vi.fn(handle),
    treeline: vi.fn(handle),
    orb: vi.fn(handle),
    crackle: vi.fn(handle),
    dithered: vi.fn(() => ({ ready: Promise.resolve(), hot: vi.fn(), develop: vi.fn(), destroy: vi.fn() })),
  };
});
vi.mock("@/lib/onebit.js", () => fx);

const { Crackle, Dithered, Forest, Orb, Treeline } = await import("@/components/OneBit");

beforeAll(() => {
  // A 2D context, so the mounts create their effects (setup.ts returns null).
  HTMLCanvasElement.prototype.getContext = (() => ({})) as unknown as HTMLCanvasElement["getContext"];
});

afterEach(() => {
  document.documentElement.className = "";
  window.localStorage.clear();
});

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const last = <T,>(m: { mock: { results: { value: unknown }[] } }) => m.mock.results.at(-1)!.value as T;

describe("rendition switch", () => {
  it("repaints every canvas when the <html> class changes, and stops after unmount", async () => {
    const view = render(
      <>
        <Forest />
        <Treeline />
        <Orb />
        <Crackle />
        <Dithered src="/x.webp" hot />
      </>,
    );
    const anims = [fx.forest, fx.treeline, fx.orb, fx.crackle].map((m) => last<{ redraw: ReturnType<typeof vi.fn> }>(m));
    const image = last<{ hot: ReturnType<typeof vi.fn> }>(fx.dithered);
    image.hot.mockClear();

    document.documentElement.classList.add("xerox-hc");
    await flush();

    for (const a of anims) expect(a.redraw).toHaveBeenCalledTimes(1);
    // Dithered has no redraw(); hot() repaints, and must keep the current state.
    expect(image.hot).toHaveBeenCalledWith(true);

    view.unmount();
    document.documentElement.classList.replace("xerox-hc", "night");
    await flush();
    for (const a of anims) expect(a.redraw).toHaveBeenCalledTimes(1);
  });

  it("ignores attribute changes other than the class", async () => {
    render(<Treeline />);
    const a = last<{ redraw: ReturnType<typeof vi.fn> }>(fx.treeline);
    document.documentElement.style.colorScheme = "light";
    await flush();
    expect(a.redraw).not.toHaveBeenCalled();
  });
});

describe("first paint", () => {
  // The inline script in index.html's head, which runs before any canvas exists.
  const html = readFileSync(path.resolve(__dirname, "../../index.html"), "utf8");
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((s) => s.includes("localStorage"));
  const run = () => new Function(script!)();

  it("puts the stored rendition's class on <html> before the app mounts", () => {
    expect(script).toBeDefined();
    for (const id of ["night", "night-hc", "xerox", "xerox-hc"]) {
      document.documentElement.className = "";
      window.localStorage.setItem("theme", id);
      run();
      expect(document.documentElement.classList.contains(id)).toBe(true);
    }
  });

  it("leaves unknown or legacy ids to ThemeProvider, and survives blocked storage", () => {
    window.localStorage.setItem("theme", "stock");
    run();
    window.localStorage.setItem("theme", "x onclick=alert(1)");
    run();
    expect(document.documentElement.className).toBe("");

    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(run).not.toThrow();
    spy.mockRestore();
  });
});
