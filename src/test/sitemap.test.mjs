import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { lastModified } from "../../scripts/generate-sitemap.mjs";

// <lastmod> should say when the page's content last changed, not when the
// build ran: the build regenerates files under src/, so their mtimes are
// always "today".
const root = path.resolve(__dirname, "../..");
const today = () => new Date().toISOString().slice(0, 10);

describe("sitemap lastmod", () => {
  it("is the date of the last commit that touched the content", () => {
    const expected = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", "src", ":!src/test", "public", "index.html", "config/site.config.json"],
      { cwd: root, encoding: "utf8" },
    ).trim();
    expect(expected).toMatch(/^\d{4}-\d\d-\d\d$/);
    expect(lastModified(root)).toBe(expected);
  });

  it("falls back to today outside a git checkout", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "sitemap-"));
    try {
      expect(lastModified(dir)).toBe(today());
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
