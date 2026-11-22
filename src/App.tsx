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

type Mode = Scheme | "system";

/**
 * The Astryx `arda` theme around the page. <Theme> owns <html data-theme>, so
 * the pinned scheme reaches it as `mode`: read from storage for the first
 * client render (the head script has already put it on <html>, so nothing
 * flashes), then kept in step with the bar's switch through SCHEME_EVENT. The
 * prerender has no storage and renders "system".
 */
const App = () => {
  const [mode, setMode] = useState<Mode>(() =>
    typeof window === "undefined" ? "system" : (readScheme(SCHEME_KEY) ?? "system"),
  );

  useEffect(() => {
    const onScheme = (event: Event) => setMode((event as CustomEvent<Scheme | null>).detail ?? "system");
    document.addEventListener(SCHEME_EVENT, onScheme);
    return () => document.removeEventListener(SCHEME_EVENT, onScheme);
  }, []);

  // Children commit first, so every section and entry id exists by now.
  useEffect(() => landOnHash(), []);

  return (
    <Theme theme={themes[defaultThemeSlug]} mode={mode}>
      <LandingPage />
    </Theme>
  );
};

export default App;
