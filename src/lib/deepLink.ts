/**
 * Lands the URL's #fragment on first load. The build prerenders the page, so
 * the browser's own jump finds #record, #contact, #catalogue and card ids
 * (#AK-5-0158) in the static HTML; but then createRoot replaces that markup
 * with the client render and the canvases and fonts settle, which can leave
 * the target off-screen. (Under `npm run dev` there is no static markup, and
 * this is the only landing.) In-page links after that are the browser's own
 * job.
 *
 * The forest, the canvases and the web fonts settle after mount and can push
 * the target down, so it is landed again on every body resize until the
 * visitor scrolls, clicks or types, or SETTLE_MS have passed.
 */

const SETTLE_MS = 6000;
const TAKEOVER = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

function target(): HTMLElement | null {
  const raw = window.location.hash.slice(1);
  if (!raw) return null;
  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    // Malformed percent-encoding: try the fragment as it stands.
  }
  return document.getElementById(id);
}

/** Call once after the first mount; returns a cleanup. */
export function landOnHash(): () => void {
  if (!target()) return () => {};

  let done = false;
  // "instant" overrides the stylesheet's smooth scrolling: arrive, don't glide.
  const land = () => {
    if (!done) target()?.scrollIntoView({ block: "start", behavior: "instant" });
  };
  land();

  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(land) : null;
  ro?.observe(document.body);
  window.addEventListener("load", land);
  void document.fonts?.ready.then(land);
  const timer = window.setTimeout(() => stop(), SETTLE_MS);

  function stop() {
    if (done) return;
    done = true;
    ro?.disconnect();
    window.clearTimeout(timer);
    window.removeEventListener("load", land);
    for (const type of TAKEOVER) window.removeEventListener(type, stop, true);
  }
  for (const type of TAKEOVER) window.addEventListener(type, stop, { capture: true, passive: true });

  return stop;
}
