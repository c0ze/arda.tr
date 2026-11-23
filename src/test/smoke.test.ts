import { afterEach, describe, expect, it, vi } from "vitest";
import { startSmoke } from "../../brand/smoke.js";

// The film over the plume is decoration. It must never take the artwork away:
// where it cannot run, or the visitor asked for less motion, the image stays.
const page = () => {
  document.body.innerHTML =
    '<div class="ix-smoke"><img data-smoke-video="/art/plume-smoke.mp4" src="/art/plume.webp" alt=""></div>';
  return document.querySelector(".ix-smoke") as HTMLElement;
};

const browser = (reduce: boolean, intersecting: boolean) => {
  vi.stubGlobal("matchMedia", () => ({ matches: reduce, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(private seen: (entries: { isIntersecting: boolean }[]) => void) {}
      observe() {
        this.seen([{ isIntersecting: intersecting }]);
      }
      disconnect() {}
    },
  );
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("smoke film", () => {
  it("leaves the image alone where the browser lacks what it needs", () => {
    const wrap = page();
    expect(() => startSmoke()()).not.toThrow();
    expect(wrap.querySelector("video")).toBeNull();
  });

  it("never fetches the film under reduced motion", () => {
    browser(true, true);
    const wrap = page();
    startSmoke();
    expect(wrap.querySelector("video")).toBeNull();
  });

  // A phone shows the plume as a narrow band: not worth megabytes of film.
  it("does not fetch the film while the image's media query does not match", () => {
    browser(false, true);
    const wrap = page();
    wrap.querySelector("img")!.dataset.smokeMedia = "(min-width: 60rem)";
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    startSmoke();
    expect(wrap.querySelector("video")).toBeNull();
  });

  it("waits until the artwork is near the screen before fetching the film", () => {
    browser(false, false);
    const wrap = page();
    startSmoke();
    expect(wrap.querySelector("video")).toBeNull();
  });

  // A scroll can queue "left" and "entered" together: the film must follow the last.
  it("goes by the latest of several visibility changes delivered at once", () => {
    browser(false, false);
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private seen: (entries: { isIntersecting: boolean }[]) => void) {}
        observe() {
          this.seen([{ isIntersecting: false }, { isIntersecting: true }]);
        }
        disconnect() {}
      },
    );
    const wrap = page();
    startSmoke();
    expect(wrap.querySelector("video")).not.toBeNull();
  });

  it("plays the film muted over the image, and shows it only once it plays", () => {
    browser(false, true);
    const wrap = page();
    const stop = startSmoke();
    const video = wrap.querySelector("video")!;
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.getAttribute("src")).toBe("/art/plume-smoke.mp4");
    expect(wrap.dataset.smoke).toBe("pending");
    video.dispatchEvent(new Event("playing"));
    expect(wrap.dataset.smoke).toBe("on");

    stop();
    expect(wrap.querySelector("video")).toBeNull();
    expect(wrap.dataset.smoke).toBeUndefined();
  });
});
