import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(configDir, "..");

export default defineConfig({
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "IMPORT_IS_UNDEFINED"
          && warning.id?.includes("lustre/runtime/server/runtime.ffi.mjs")
          && warning.message.includes("to_server_component_config")
        ) {
          return;
        }

        warn(warning);
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
  css: {
    postcss: configDir,
  },
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "src"),
    },
  },
});
