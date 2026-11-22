import { useEffect, useState } from "react";
import { Theme } from "@astryxdesign/core/theme";
import { defaultThemeSlug, themes } from "./astryx-themes";
import { landOnHash } from "@/lib/deepLink";
import { SCHEME_EVENT, readScheme, type Scheme } from "../brand/scheme.js";
import * as RescriptApp from "./App.res.mjs";

const LandingPage = RescriptApp.make;

// The localStorage key of the pinned scheme: the same one index.html's head
// script and the bar's switch (Bar.res) use.
const SCHEME_KEY = "theme";

// arda.tr is dark unless the visitor pins light (as Bar.res and the head script).
const SCHEME_DEFAULT: Scheme = "dark";

/** Opens the works category that holds the URL's #fragment, so the entry can be landed on. */
function openTargetCategory() {
  let id = window.location.hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // Malformed percent-encoding: try the fragment as it stands.
  }
  if (!id) return;
  document.getElementById(id)?.closest("details")?.setAttribute("open", "");
}

/**
 * The Astryx `arda` theme around the page. <Theme> owns <html data-theme>, so
 * the scheme reaches it as `mode`: the pinned one from storage for the first
 * client render (the head script has already put it on <html>, so nothing
 * flashes), then kept in step with the bar's switch through SCHEME_EVENT. The
 * prerender has no storage and renders the default.
 */
const App = () => {
  const [mode, setMode] = useState<Scheme>(() =>
    typeof window === "undefined" ? SCHEME_DEFAULT : (readScheme(SCHEME_KEY) ?? SCHEME_DEFAULT),
  );

  useEffect(() => {
    const onScheme = (event: Event) => setMode((event as CustomEvent<Scheme | null>).detail ?? SCHEME_DEFAULT);
    document.addEventListener(SCHEME_EVENT, onScheme);
    return () => document.removeEventListener(SCHEME_EVENT, onScheme);
  }, []);

  // Children commit first, so every section and entry id exists by now. An
  // entry sits inside a category that may be closed: open it, then land.
  useEffect(() => {
    openTargetCategory();
    return landOnHash();
  }, []);

  return (
    <Theme theme={themes[defaultThemeSlug]} mode={mode}>
      <LandingPage />
    </Theme>
  );
};

export default App;
