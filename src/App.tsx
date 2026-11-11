import { useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { siteConfig, themes } from "@/config/site";
import { landOnHash } from "@/lib/deepLink";
import * as RescriptApp from "./App.res.mjs";

const LandingPage = RescriptApp.make;

const App = () => {
  // Children commit first, so every section and card id exists by now.
  useEffect(() => landOnHash(), []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={siteConfig.defaultTheme}
      disableTransitionOnChange
      themes={themes.map((theme) => theme.id)}
    >
      <LandingPage />
    </ThemeProvider>
  );
};

export default App;
