import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(configDir, "..");

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "src"),
    },
  },
  test: {
    exclude: ["build/**", "dist/**", "node_modules/**"],
    environment: "jsdom",
    globals: true,
    setupFiles: [path.resolve(projectRoot, "src/test/setup.ts")],
  },
});
