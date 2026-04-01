import { watch } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function spawnNpm(args) {
  return spawn(npmCommand, args, {
    cwd: projectRoot,
    stdio: "inherit",
  });
}

function runNpm(args) {
  return new Promise((resolve, reject) => {
    const child = spawnNpm(args);

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${npmCommand} ${args.join(" ")} exited with code ${code ?? "unknown"}`));
    });
  });
}

let rebuildRunning = false;
let rebuildQueued = false;
let debounceTimer;

function queueRebuild(reason) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    console.log(`[gleam] change detected in ${reason}`);
    void runRebuild();
  }, 120);
}

async function runRebuild() {
  if (rebuildRunning) {
    rebuildQueued = true;
    return;
  }

  rebuildRunning = true;

  try {
    await runNpm(["run", "gleam:build"]);
  } catch (error) {
    console.error("[gleam] rebuild failed");
    console.error(error);
  } finally {
    rebuildRunning = false;

    if (rebuildQueued) {
      rebuildQueued = false;
      void runRebuild();
    }
  }
}

function normalizeWatchedPath(filePath) {
  return filePath.replaceAll("\\", "/");
}

function handleSourceChange(filePath) {
  const normalizedPath = normalizeWatchedPath(filePath);

  if (normalizedPath.endsWith("site_config.gleam")) {
    return;
  }

  if (normalizedPath.endsWith(".gleam") || normalizedPath.endsWith("_ffi.mjs")) {
    queueRebuild(normalizedPath);
  }
}

async function main() {
  await runNpm(["run", "gleam:build"]);

  const vite = spawnNpm(["run", "vite:serve"]);

  const watchers = [
    watch(path.join(projectRoot, "src"), { recursive: true }, (_eventType, filePath) => {
      if (typeof filePath === "string") {
        handleSourceChange(filePath);
      }
    }),
    watch(path.join(projectRoot, "config", "site.config.json"), () => {
      queueRebuild("config/site.config.json");
    }),
    watch(path.join(projectRoot, "gleam.toml"), () => {
      queueRebuild("gleam.toml");
    }),
  ];

  const shutdown = (code = 0) => {
    for (const watcher of watchers) {
      watcher.close();
    }

    vite.kill("SIGTERM");
    process.exit(code);
  };

  vite.on("exit", (code) => {
    shutdown(code ?? 0);
  });

  process.on("SIGINT", () => shutdown());
  process.on("SIGTERM", () => shutdown());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
