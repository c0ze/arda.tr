import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { themes } from "@/config/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Stock / Microfiche selector, set as a catalogue metadata field rather than a
 * button: the current rendition is named in mono, and the menu lists the four
 * with a square swatch each.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className="cat-chip text-muted-foreground" aria-hidden="true">
        STOCK ▾
      </span>
    );
  }

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cat-chip inline-flex items-center gap-2" aria-label="Select rendition">
          <span
            className="inline-block h-2.5 w-2.5 border border-rule"
            style={{ backgroundColor: currentTheme.color }}
            aria-hidden="true"
          />
          {currentTheme.name} ▾
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border border-rule bg-background p-0">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex cursor-pointer items-center gap-2.5 border-b border-rule px-3 py-2 last:border-b-0 ${
              theme === t.id ? "bg-card" : ""
            }`}
          >
            <span
              className="inline-block h-3 w-3 border border-rule"
              style={{ backgroundColor: t.color }}
              aria-hidden="true"
            />
            <span className="font-display text-sm font-semibold">{t.name}</span>
            <span className="cat-label ml-auto text-muted-foreground">
              {theme === t.id ? "active" : t.hint}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
