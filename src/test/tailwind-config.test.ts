import { describe, expect, it } from "vitest";
import tailwindConfig from "../../config/tailwind.config";

describe("tailwind config", () => {
  it("scans Gleam source files for utility classes", () => {
    const content = tailwindConfig.content;

    expect(Array.isArray(content)).toBe(true);
    expect(content).toContain("./src/**/*.{ts,tsx,gleam}");
  });
});
