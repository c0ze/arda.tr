import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

/**
 * The page as static markup, for scripts/prerender.mjs to put into
 * dist/index.html at build time, so crawlers and readers without JavaScript
 * get the text and the links. Same tree as src/main.tsx mounts; keep the two
 * in step. main.tsx uses createRoot, not hydrateRoot: React replaces this
 * markup on mount, so it never has to match the client render exactly.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
