import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#portfolio" },
  { label: "Music", href: "#music" },
  { label: "Contact", href: "#contact" },
];

/**
 * Sticky top navigation. Transparent over the hero, then condenses into a
 * frosted-glass bar once the user scrolls. Anchor links are hidden on small
 * screens (the page is short and scrollable); the wordmark and theme picker
 * stay visible everywhere.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full px-3 py-2 transition-all duration-300 sm:px-4 ${
          scrolled ? "glass shadow-soft" : "border border-transparent bg-transparent"
        }`}
      >
        <a
          href="#top"
          className="group flex items-center gap-2 rounded-full px-2 py-1 font-mono text-sm font-medium text-foreground"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-aurora transition-transform duration-300 group-hover:scale-125" />
          <span>
            arda<span className="text-primary">.tr</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://resume.arda.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform duration-200 hover:scale-[1.03] sm:inline-flex"
          >
            Resume
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
