import { ThemeProvider } from "@/components/ThemeProvider";
import { themes } from "@/config/site";
import Index from "./pages/Index";

const App = () => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    disableTransitionOnChange
    themes={themes.map((theme) => theme.id)}
  >
    <Index />
  </ThemeProvider>
);

export default App;
