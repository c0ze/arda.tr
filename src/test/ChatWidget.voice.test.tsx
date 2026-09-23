import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { make as ChatWidget } from "@/components/ChatWidget.res.mjs";
import { setVoiceEnabled } from "@/lib/voice.js";

// A fake Web Audio graph: every node connects, clips "decode" to one second,
// and the test moves the clock by hand, so the reveal is deterministic.
const clock = { now: 0 };
const played: { stopped: boolean }[] = [];

function param() {
  return { value: 0 };
}
function node() {
  return {
    connect: (target: unknown) => target,
    start() {},
    stop() {},
    gain: param(), frequency: param(), Q: param(), delayTime: param(),
    threshold: param(), knee: param(), ratio: param(), attack: param(), release: param(),
    fftSize: 1024,
    getFloatTimeDomainData(a: Float32Array) { a.fill(0); }, // silent: no orb updates to wrap in act()
  };
}
class FakeAudioContext {
  state = "running";
  sampleRate = 44100;
  destination = node();
  get currentTime() { return clock.now; }
  resume() { return Promise.resolve(); }
  createBuffer() { return {}; }
  createBufferSource() {
    const src = { ...node(), buffer: null, onended: null, stopped: false, stop() { src.stopped = true; } };
    played.push(src);
    return src;
  }
  createGain() { return node(); }
  createOscillator() { return node(); }
  createWaveShaper() { return node(); }
  createBiquadFilter() { return node(); }
  createDelay() { return node(); }
  createDynamicsCompressor() { return node(); }
  createAnalyser() { return node(); }
  decodeAudioData(_b: ArrayBuffer, ok: (b: { duration: number }) => void) { ok({ duration: 1 }); }
}

const encoder = new TextEncoder();
const frame = (e: object) => encoder.encode(`data: ${JSON.stringify(e)}\n\n`);

function stream() {
  const queue: Uint8Array[] = [];
  let wake: (() => void) | null = null;
  const read = () => new Promise<{ done: boolean; value?: Uint8Array }>((resolve) => {
    const next = () => resolve({ done: false, value: queue.shift() });
    if (queue.length) next(); else wake = next;
  });
  const fetch = vi.fn().mockResolvedValue({ ok: true, body: { getReader: () => ({ read, cancel: async () => {} }) } });
  const emit = (...events: object[]) => act(async () => {
    for (const e of events) queue.push(frame(e));
    const w = wake; wake = null; w?.();
    await new Promise((r) => setTimeout(r, 0));
  });
  return { fetch, emit };
}

// Let the speaker's 250 ms tick see the new clock.
const tick = () => act(() => new Promise((r) => setTimeout(r, 300)));
const reply = () => screen.getAllByText((_, el) => !!el?.classList.contains("msg-txt")).at(-1)!;

beforeEach(() => {
  clock.now = 0;
  played.length = 0;
  vi.stubGlobal("AudioContext", FakeAudioContext);
});
afterEach(() => {
  cleanup(); // unmount first: resetting the shared choice would update a mounted widget
  vi.unstubAllGlobals();
  setVoiceEnabled(true);
  localStorage.clear();
});

it("asks for voice by default and reveals the reply only as far as it is spoken", async () => {
  const { fetch, emit } = stream();
  vi.stubGlobal("fetch", fetch);
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  expect(screen.getByRole("button", { name: "Voice" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  const body = JSON.parse(fetch.mock.calls[0][1].body);
  expect(body).toMatchObject({ message: "What does Arda build?", voice: true, lang: "en" });

  const text = "Hello there. Second part.";
  await emit({ type: "thinking" }, { type: "voice", on: true }, { type: "chunk", text });
  // Streamed, but nothing spoken yet: only the cursor shows.
  expect(reply().textContent).toBe("");

  await emit({ type: "speech", seq: 0, start: 0, end: 12, audio: "AAAA", mime: "audio/mpeg", marks: [{ o: 6, t: 0.5 }] });
  clock.now = 0.55; // half a second into the clip (it starts 50 ms after scheduling)
  await tick();
  expect(reply().textContent).toBe("Hello ");

  await emit({ type: "speech_end", upto: 12 }, { type: "done", text });
  expect(screen.getByRole("textbox")).toBeEnabled();
  expect(reply().textContent).toBe("Hello ");

  clock.now = 2; // the clip has played: everything shows
  await tick();
  expect(reply().textContent).toBe(text);
});

it("sends a text-only request when muted, and the toggle persists", async () => {
  const { fetch, emit } = stream();
  vi.stubGlobal("fetch", fetch);
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  const toggle = screen.getByRole("button", { name: "Voice" });
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(localStorage.getItem("voice")).toBe("off");
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ message: "What does Arda build?", history: [] });
  await emit({ type: "thinking" }, { type: "chunk", text: "Plain answer" });
  expect(await screen.findByText("Plain answer")).toBeVisible();
});

it("muting mid-reply silences it and shows the whole reply", async () => {
  const { fetch, emit } = stream();
  vi.stubGlobal("fetch", fetch);
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  await emit({ type: "thinking" }, { type: "voice", on: true }, { type: "chunk", text: "Spoken words." },
    { type: "speech", seq: 0, start: 0, end: 13, audio: "AAAA", marks: [] });
  expect(reply().textContent).toBe("");
  const clip = played.at(-1)!;
  fireEvent.click(screen.getByRole("button", { name: "Voice" }));
  expect(reply().textContent).toBe("Spoken words.");
  expect(clip.stopped).toBe(true);
});

it("closing the widget silences the voice", async () => {
  const { fetch, emit } = stream();
  vi.stubGlobal("fetch", fetch);
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  await emit({ type: "thinking" }, { type: "voice", on: true }, { type: "chunk", text: "Words." },
    { type: "speech", seq: 0, start: 0, end: 6, audio: "AAAA", marks: [] });
  const clip = played.at(-1)!;
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(clip.stopped).toBe(true);
});
