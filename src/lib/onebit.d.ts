/* Types for onebit.js (the family's shared 1-bit engine, vendored verbatim). */

export interface Anim {
  redraw(): void;
  readonly reduced: boolean;
  destroy(): void;
}

export interface ForestOptions {
  seed?: number;
  speed?: number;
  maxWidth?: number;
  px?: number;
  fps?: number;
  /** Mast light position in CSS px relative to the canvas; x is null while the mast is off-canvas. */
  onMast?: ((x: number | null, y: number) => void) | null;
  /** Werewolf and bat walk-ons, taking turns; on by default. */
  creatures?: boolean;
  /** Seconds before the first walk-on, and between walk-ons. */
  creatureFirst?: number;
  creatureEvery?: number;
  /** Called at notable moments, e.g. ("wolf", "howl"). */
  onCreature?: ((kind: "wolf" | "bat", moment: string) => void) | null;
  /** Horizontal sprite sheet for the werewolf (dark figure, light rim lines, transparent background). */
  werewolfSprite?: { src: string; frames?: number; run?: [number, number]; rise?: number; howl?: number } | null;
}

export interface Forest extends Anim {
  /** Bring a creature on right away. */
  summon(kind: "wolf" | "bat"): void;
}

export interface TreelineOptions {
  seed?: number;
  px?: number;
  speed?: number;
  fps?: number;
}

export interface DitheredOptions {
  px?: number;
  invert?: "auto" | boolean;
  contrast?: number;
  lift?: number;
  motion?: "drift" | "still";
  fps?: number;
  fallbackSeed?: number | null;
}

export interface Dithered {
  ready: Promise<void>;
  hot(on: boolean): void;
  develop(): void;
  destroy(): void;
}

export interface OrbOptions {
  size?: number;
  speed?: number;
  seed?: number;
  fps?: number;
}

export interface Orb extends Anim {
  sizzle(amount?: number): void;
}

export interface CrackleOptions {
  w?: number;
  h?: number;
  density?: number;
  fps?: number;
}

export const B8: Float32Array;
export function reducedMotion(): boolean;
export function rng(seed: number): () => number;
export function hash(str: string): number;
export function forest(canvas: HTMLCanvasElement, opts?: ForestOptions): Forest;
export function treeline(canvas: HTMLCanvasElement, opts?: TreelineOptions): Anim;
export function dithered(canvas: HTMLCanvasElement, src: string | HTMLImageElement | null, opts?: DitheredOptions): Dithered;
export function orb(canvas: HTMLCanvasElement, opts?: OrbOptions): Orb;
export function crackle(canvas: HTMLCanvasElement, opts?: CrackleOptions): Anim;
