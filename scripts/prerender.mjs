/**
 * Prerenders the page into dist/index.html after `vite build`, so crawlers
 * and readers that do not run JavaScript get the text and the links. Vite
 * loads src/entry-server.tsx (ReScript output included) through its SSR
 * module loader and React renders it to a string; the canvases come out
 * empty, since all engine work happens in effects.
 *
 * The client still mounts with createRoot and replaces this markup, so it
 * only has to be the same content, not a hydration-exact match.
 *
 * Fails the build if the placeholder is missing, the render throws, or React
 * logs an error while rendering.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexFile = path.join(projectRoot, "dist", "index.html");
const PLACEHOLDER = '<div id="root"></div>';

/** One render and done: no HMR, no WebSocket (Vite would bind 24678), no watcher. */
export const ssrServerOptions = { middlewareMode: true, hmr: false, ws: false, watch: null };

/**
 * Puts the markup inside <div id="root">. A function replacer, because a
 * string replacement would expand `$&`, `$1`, `$$` in the rendered text.
 */
export function injectAppHtml(template, appHtml) {
  if (!template.includes(PLACEHOLDER)) {
    throw new Error(`prerender: placeholder ${PLACEHOLDER} not found in index.html`);
  }
  return template.replace(PLACEHOLDER, () => `<div id="root">${appHtml}</div>`);
}

async function renderApp() {
  const { createServer } = await import("vite");
  const server = await createServer({
    root: projectRoot,
    configFile: path.join(projectRoot, "config/vite.config.ts"),
    server: ssrServerOptions,
    appType: "custom",
    optimizeDeps: { noDiscovery: true, include: [] },
    logLevel: "warn",
  });
  const errors = [];
  const consoleError = console.error;
  console.error = (...args) => errors.push(args.map(String).join(" "));
  try {
    const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
    const html = render();
    if (errors.length > 0) throw new Error(`prerender: console.error while rendering:\n${errors.join("\n")}`);
    return html;
  } finally {
    console.error = consoleError;
    await server.close();
  }
}

async function main() {
  const template = await fs.readFile(indexFile, "utf8");
  const appHtml = await renderApp();
  await fs.writeFile(indexFile, injectAppHtml(template, appHtml), "utf8");
  console.log(`Prerendered ${appHtml.length} bytes of markup into ${indexFile}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error("Prerender failed:", err);
    process.exit(1);
  });
}
