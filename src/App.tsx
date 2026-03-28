import { ThemeProvider } from "@/components/ThemeProvider";
import { themes } from "@/config/site";
import Index from "./pages/Index";

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme={themes[0].id}
    disableTransitionOnChange
    themes={themes.map((theme) => theme.id)}
  >
    <Index />
  </ThemeProvider>
);

export default App;
