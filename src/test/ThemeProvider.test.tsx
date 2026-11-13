import { afterEach, describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { themes } from "@/config/site";

// Returning visitors carry ids from retired theme systems. Each must land on
// the rendition with the same role (light / AAA light / dark / AAA dark);
// anything unknown is dropped so the default applies.
const mount = () =>
  render(
    <ThemeProvider attribute="class" defaultTheme="night" disableTransitionOnChange themes={themes.map((t) => t.id)}>
      <p>page</p>
    </ThemeProvider>,
  );

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.className = "";
  document.documentElement.removeAttribute("style");
});

describe("stored theme migration", () => {
  it.each([
    ["stock", "xerox"],
    ["stock-hc", "xerox-hc"],
    ["microfiche", "night"],
    ["microfiche-hc", "night-hc"],
    ["paper", "xerox-hc"],
    ["carbon", "night-hc"],
    ["dracula", "night"],
  ])("maps the legacy id %s to %s", (legacy, rendition) => {
    window.localStorage.setItem("theme", legacy);
    mount();
    expect(window.localStorage.getItem("theme")).toBe(rendition);
    expect(document.documentElement).toHaveClass(rendition);
    expect(document.documentElement).not.toHaveClass(legacy);
  });

  it("drops an unknown id, so the default rendition applies", () => {
    window.localStorage.setItem("theme", "x onclick=alert(1)");
    mount();
    expect(window.localStorage.getItem("theme")).toBeNull();
    expect(document.documentElement.className).toBe("night");
  });

  it("keeps a current id as it is", () => {
    for (const { id } of themes) {
      window.localStorage.setItem("theme", id);
      const view = mount();
      expect(window.localStorage.getItem("theme")).toBe(id);
      expect(document.documentElement.className).toBe(id);
      view.unmount();
      document.documentElement.className = "";
    }
  });
});
