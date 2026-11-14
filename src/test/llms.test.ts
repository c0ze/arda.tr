import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// llms.txt is what an LLM reads instead of the page. Its summary says the page
// links to the résumé, blog and AI chat, so the file has to carry those links.
const llms = readFileSync(path.resolve(__dirname, "../../public/llms.txt"), "utf8");
const links = [...llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);
const section = (title: string) => llms.split(`## ${title}\n`)[1]?.split("\n## ")[0] ?? "";

describe("llms.txt", () => {
  it("links the family sites its summary promises", () => {
    expect(llms).toMatch(/links to his résumé, blog and AI chat/);
    for (const url of ["https://resume.arda.tr/", "https://blog.arda.tr/", "https://ai.arda.tr/", "https://lind.arda.tr/"]) {
      expect(section("Sites")).toContain(`](${url})`);
    }
    // Sites comes before Projects, as the page's own nav does.
    expect(llms.indexOf("## Sites")).toBeLessThan(llms.indexOf("## Projects"));
  });

  it("lists the newest works and none the catalogue has retired", () => {
    for (const url of ["https://king.arda.tr/", "https://armarium.skriv.ist/", "https://books.skriv.ist/"]) {
      expect(section("Projects")).toContain(`](${url})`);
    }
    expect(links.some((u) => u.includes("commit.gand.tr"))).toBe(false);
  });

  it("carries the family's one link to coze.org", () => {
    expect(section("Elsewhere")).toContain("[coze.org](https://coze.org/)");
  });
});
