import { ThemeProvider } from "@/components/ThemeProvider";
import { themes } from "@/config/site";
import * as RescriptApp from "./App.res.mjs";

const LandingPage = RescriptApp.make;

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme={themes[0].id}
    disableTransitionOnChange
    themes={themes.map((theme) => theme.id)}
  >
    <LandingPage />
  </ThemeProvider>
);

export default App;
