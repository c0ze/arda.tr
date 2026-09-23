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
 * The rendition switch at the right end of the status bar: the current
 * rendition's id in a bordered mono chip, opening a menu of all four.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className="rend" aria-hidden="true">
        {themes[0].id}
      </span>
    );
  }

  const current = themes.find((t) => t.id === theme) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="rend" aria-label="Select rendition">
          {current.id} ▾
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {themes.map((t) => (
          <DropdownMenuItem key={t.id} onClick={() => setTheme(t.id)} className={theme === t.id ? "text-signal" : ""}>
            <span className="inline-block h-3 w-3 border border-fg-2" style={{ backgroundColor: t.color }} aria-hidden="true" />
            <span>{t.id}</span>
            <span className="ml-auto text-fg-2">{theme === t.id ? "● on" : t.hint}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
