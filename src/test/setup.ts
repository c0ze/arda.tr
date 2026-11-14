import "@testing-library/jest-dom/vitest";

// Browser stubs; tests that run in the node environment (the prerender) have no window.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  // jsdom has no 2D canvas. Return null quietly (instead of jsdom's "not
  // implemented" error) so the 1-bit mounts in OneBit.tsx skip drawing.
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    writable: true,
    value: () => null,
  });
}
