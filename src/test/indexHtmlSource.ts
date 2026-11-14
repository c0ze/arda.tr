import { readFileSync } from "node:fs";
import path from "node:path";

/** The source index.html, and the inline head script that notes a pre-mount takeover. */
export const html = readFileSync(path.resolve(__dirname, "../../index.html"), "utf8");

export const takeoverScript = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map((m) => m[1])
  .find((s) => s.includes("takeover"));

/** Runs the takeover script as the browser would, before the bundle mounts. */
export const runTakeoverScript = () => new Function(takeoverScript ?? "")();
