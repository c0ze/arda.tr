import { useEffect, useRef } from "react";
import { crackle, dithered, forest, orb, treeline, type Dithered as DitheredFx, type Orb as OrbFx } from "@/lib/onebit.js";

/**
 * React mounts for onebit.js. Each component owns one <canvas>, creates its
 * effect on mount and destroys it on unmount, so StrictMode's double mount
 * leaves exactly one live animation. All motion policy (reduced motion,
 * off-screen and hidden-tab pauses) lives in onebit.js, not here.
 */

let canvasSupport: boolean | undefined;

/** jsdom and very old browsers have no 2D context; draw nothing there rather than throw. */
function canvasOK() {
  if (canvasSupport === undefined) {
    try {
      canvasSupport = !!document.createElement("canvas").getContext("2d");
    } catch {
      canvasSupport = false;
    }
  }
  return canvasSupport;
}

const cls = (className?: string) => (className ? `px ${className}` : "px");

interface ForestProps {
  className?: string;
  /** Called every frame with the mast light's position (CSS px, canvas-relative); x is null off-canvas. */
  onMast?: (x: number | null, y: number) => void;
}

export function Forest({ className, onMast }: ForestProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mast = useRef(onMast);
  mast.current = onMast;

  useEffect(() => {
    const el = ref.current;
    if (!el || !canvasOK()) return;
    const fx = forest(el, {
      onMast: (x, y) => mast.current?.(x, y),
      // drawn by Codex, animated in Aseprite: see art/werewolf/
      werewolfSprite: { src: "/werewolf.png", frames: 8, run: [0, 5], rise: 6, howl: 7 },
    });
    // ?summon=wolf or ?summon=bat brings one on without waiting for its turn
    const kind = new URLSearchParams(window.location.search).get("summon");
    if (kind === "wolf" || kind === "bat") window.setTimeout(() => fx.summon(kind), 1200);
    return () => fx.destroy();
  }, []);

  return <canvas ref={ref} className={cls(className)} aria-hidden="true" />;
}

interface TreelineProps {
  className?: string;
  seed?: number;
  px?: number;
  speed?: number;
}

export function Treeline({ className, seed = 1, px = 2, speed = 0 }: TreelineProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canvasOK()) return;
    const fx = treeline(el, { seed, px, speed });
    return () => fx.destroy();
  }, [seed, px, speed]);

  return <canvas ref={ref} className={cls(className)} aria-hidden="true" />;
}

interface DitheredProps {
  className?: string;
  /** Image URL; empty draws a seeded sigil instead. */
  src: string;
  fallbackSeed?: number;
  px?: number;
  contrast?: number;
  lift?: number;
  invert?: boolean;
  /** Redraw in the signal colour and replay the develop-from-noise. */
  hot?: boolean;
}

export function Dithered({ className, src, fallbackSeed, px = 2, contrast, lift, invert, hot = false }: DitheredProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const fx = useRef<DitheredFx | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canvasOK()) return;
    const d = dithered(el, src, {
      px,
      fallbackSeed: fallbackSeed ?? null,
      ...(contrast === undefined ? {} : { contrast }),
      ...(lift === undefined ? {} : { lift }),
      ...(invert === undefined ? {} : { invert }),
    });
    fx.current = d;
    return () => {
      d.destroy();
      fx.current = null;
    };
  }, [src, fallbackSeed, px, contrast, lift, invert]);

  useEffect(() => {
    const d = fx.current;
    if (!d) return;
    d.hot(hot);
    if (hot) d.develop();
  }, [hot]);

  return <canvas ref={ref} className={cls(className)} aria-hidden="true" />;
}

interface OrbProps {
  className?: string;
  /** Pixels across. */
  size?: number;
  speed?: number;
  /** Change this (e.g. once per streamed chunk) to make the orb sizzle. 0 is ignored. */
  pulse?: number;
  /** Loudness 0..1 of a voice speaking through the orb; each new value sizzles it in proportion. */
  level?: number;
}

export function Orb({ className, size = 40, speed = 0.6, pulse = 0, level = 0 }: OrbProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const fx = useRef<OrbFx | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canvasOK()) return;
    const o = orb(el, { size, speed });
    fx.current = o;
    return () => {
      o.destroy();
      fx.current = null;
    };
  }, [size, speed]);

  useEffect(() => {
    if (pulse) fx.current?.sizzle(0.5 + Math.random() * 0.5);
  }, [pulse]);

  useEffect(() => {
    if (level > 0) fx.current?.sizzle(level * 0.6);
  }, [level]);

  return <canvas ref={ref} className={cls(className)} aria-hidden="true" />;
}

interface CrackleProps {
  className?: string;
}

/** The sizzling block cursor that trails a streaming reply. */
export function Crackle({ className }: CrackleProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canvasOK()) return;
    const fx = crackle(el);
    return () => fx.destroy();
  }, []);

  return <canvas ref={ref} className={cls(className)} aria-hidden="true" />;
}
