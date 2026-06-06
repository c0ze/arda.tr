import { useEffect, useRef } from "react";

/** Tiny SVG fractal-noise tile used for a subtle film-grain texture. */
const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

interface Blob {
  className: string;
  color: string;
  delay: string;
}

const BLOBS: Blob[] = [
  {
    className: "-left-[12%] -top-[18%] h-[58vh] w-[58vh] animate-aurora",
    color: "hsl(var(--primary) / 0.55)",
    delay: "0s",
  },
  {
    className: "-right-[10%] top-[2%] h-[52vh] w-[52vh] animate-aurora-slow",
    color: "hsl(var(--theme-pink) / 0.45)",
    delay: "-7s",
  },
  {
    className: "left-[18%] -bottom-[22%] h-[62vh] w-[62vh] animate-aurora",
    color: "hsl(var(--theme-cyan) / 0.4)",
    delay: "-13s",
  },
  {
    className: "right-[14%] -bottom-[12%] h-[46vh] w-[46vh] animate-aurora-slow",
    color: "hsl(var(--accent) / 0.4)",
    delay: "-4s",
  },
];

/**
 * Fixed, full-viewport ambient backdrop rendered behind all content:
 *   - a soft base wash,
 *   - drifting, blurred aurora blobs tinted from the active theme,
 *   - a cursor-following spotlight (fine-pointer devices only),
 *   - a film-grain overlay for texture,
 *   - top & bottom vignettes to seat foreground content.
 *
 * Theme-aware via CSS variables and GPU-light (transform/opacity only). Page
 * sections stay transparent so this shows through subtly.
 */
export function AuroraBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    let raf = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${event.clientX}px`);
        el.style.setProperty("--my", `${event.clientY}px`);
        el.style.opacity = "1";
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 bg-gradient-subtle opacity-70" />

      <div className="absolute inset-0 opacity-40 [filter:blur(58px)] sm:[filter:blur(88px)]">
        {BLOBS.map((blob, i) => (
          <span
            key={i}
            className={`absolute rounded-full ${blob.className}`}
            style={{
              background: `radial-gradient(circle at center, ${blob.color}, transparent 68%)`,
              animationDelay: blob.delay,
            }}
          />
        ))}
      </div>

      <div
        ref={spotlightRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), hsl(var(--primary) / 0.1), transparent 60%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.13] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: "180px 180px" }}
      />

      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export default AuroraBackground;
