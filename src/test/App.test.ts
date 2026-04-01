import { describe, expect, it, beforeEach } from "vitest";
import { mountApp } from "@/app";

function linkByText(text: string) {
  return Array.from(document.querySelectorAll("a")).find(
    (link) => link.textContent?.trim() === text,
  );
}

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.className = "dracula-pro";
    document.documentElement.dataset.theme = "dracula-pro";
    document.body.innerHTML = '<div id="root"></div>';
  });

  it("renders the core landing page sections and calls to action", () => {
    mountApp();

    expect(document.querySelector("h1")?.textContent).toBe("Arda Karaduman");
    expect(document.querySelector('button[aria-label="Select theme"]')).not.toBeNull();
    expect(linkByText("Resume")).toBeTruthy();
    expect(linkByText("Blog")).toBeTruthy();
    expect(linkByText("AI Chat")).toBeTruthy();

    const sectionHeadings = Array.from(document.querySelectorAll("h2")).map((heading) =>
      heading.textContent?.trim(),
    );

    expect(sectionHeadings).toEqual([
      "About",
      "Projects",
      "Games",
      "Tools",
      "Music Projects",
    ]);
  });

  it("opens the theme selector and applies a new theme", async () => {
    mountApp();

    const trigger = document.querySelector('button[aria-label="Select theme"]');
    expect(trigger).not.toBeNull();

    trigger?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));

    expect(document.querySelector('[role="menu"]')).not.toBeNull();

    const steelOption = Array.from(document.querySelectorAll('[role="menuitem"]')).find((item) =>
      item.textContent?.includes("Steel"),
    );

    expect(steelOption).toBeTruthy();

    steelOption?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));

    await Promise.resolve();

    expect(document.documentElement.dataset.theme).toBe("van-helsing");
    expect(document.documentElement.classList.contains("van-helsing")).toBe(true);
    expect(window.localStorage.getItem("theme")).toBe("van-helsing");
  });
});
