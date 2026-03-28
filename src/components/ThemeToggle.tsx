import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { themes } from "@/config/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary border border-border text-muted-foreground"
          aria-label="Select theme"
        >
          <Palette className="w-4 h-4" />
        </button>
    );
  }

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary border border-border text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all"
          aria-label="Select theme"
          title={`Theme: ${currentTheme.name}`}
        >
          <div
            className="w-4 h-4 rounded-full border border-current"
            style={{ backgroundColor: currentTheme.color }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex items-center gap-3 cursor-pointer ${
              theme === t.id ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <div
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: t.color }}
            />
            <span>{t.name}</span>
            {theme === t.id && (
              <span className="ml-auto text-xs text-primary">Active</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
