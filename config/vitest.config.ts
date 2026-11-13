import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type ViteUserConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(configDir, "..");

export default defineConfig({
  // vitest 3 runs on its own vite 7, and @vitejs/plugin-react 6 is typed
  // against the app's vite 8; it works under both, only the types differ.
  plugins: [react()] as ViteUserConfig["plugins"],
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [path.resolve(projectRoot, "src/test/setup.ts")],
    exclude: ["build/**", "dist/**", "node_modules/**"],
  },
});
