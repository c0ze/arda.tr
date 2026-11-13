import { StrictMode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { make as ChatWidget, openChat } from "@/components/ChatWidget.res.mjs";

const encoder = new TextEncoder();
afterEach(() => vi.unstubAllGlobals());

it("shows streamed replies under Strict Mode and keeps them in subsequent history", async () => {
  let emit: (value: { done: boolean; value?: Uint8Array }) => void;
  const read = vi.fn(() => new Promise((resolve) => { emit = resolve; }));
  const fetch = vi.fn().mockResolvedValue({ ok: true, body: { getReader: () => ({ read, cancel: async () => {} }) } });
  vi.stubGlobal("fetch", fetch);
  render(<StrictMode><ChatWidget /></StrictMode>);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  await waitFor(() => expect(read).toHaveBeenCalledTimes(1));
  emit!({ done: false, value: encoder.encode('data: {"type":"chunk","text":"Visible answer"}\n\n') });
  expect(await screen.findByText("Visible answer")).toBeVisible();
  await waitFor(() => expect(read).toHaveBeenCalledTimes(2));
  emit!({ done: false, value: encoder.encode('data: {"type":"done","text":"Visible answer"}\n\n') });
  const input = screen.getByRole("textbox");
  await waitFor(() => expect(input).toBeEnabled());
  fireEvent.change(input, { target: { value: "Follow up" } });
  fireEvent.click(screen.getByRole("button", { name: "Send (enter)" }));
  expect(JSON.parse(fetch.mock.calls[1][1].body).history).toContainEqual({ role: "model", content: "Visible answer" });
  await waitFor(() => expect(read).toHaveBeenCalledTimes(3));
  emit!({ done: false, value: encoder.encode('data: {"type":"done","text":"Second answer"}\n\n') });
  expect(await screen.findByText("Second answer", { selector: "p" })).toBeVisible();
});

it("uses the fallback when streaming ends without a reply", async () => {
  const fetch = vi.fn()
    .mockResolvedValueOnce({ ok: true, body: { getReader: () => ({ read: async () => ({ done: true }), cancel: async () => {} }) } })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ reply: "Fallback answer" }) });
  vi.stubGlobal("fetch", fetch);
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  expect(await screen.findByText("Fallback answer", { selector: "p" })).toBeVisible();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls[1][0]).toMatch(/\/api\/chat$/);
  expect(screen.getByRole("textbox")).toBeEnabled();
});

// A definitive answer from the server is not retried on /api/chat: that would
// pay for a blocked reply twice, or spend a rate-limited visitor's next slot.
it("shows the error without a fallback after HTTP 429 or an SSE error event", async () => {
  const fetch = vi.fn()
    .mockResolvedValueOnce({ ok: false, status: 429, body: null })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: { getReader: () => ({ read: vi.fn().mockResolvedValueOnce({ done: false, value: encoder.encode('data: {"type":"error","message":"no"}\n\n') }), cancel: async () => {} }) },
    });
  vi.stubGlobal("fetch", fetch);
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  await waitFor(() => expect(screen.getAllByText(/couldn't reach the assistant/, { selector: ".msg-txt" })).toHaveLength(1));
  expect(fetch).toHaveBeenCalledTimes(1);

  const input = screen.getByRole("textbox");
  await waitFor(() => expect(input).toBeEnabled());
  fireEvent.change(input, { target: { value: "Again" } });
  fireEvent.submit(input.closest("form")!);
  await waitFor(() => expect(screen.getAllByText(/couldn't reach the assistant/, { selector: ".msg-txt" })).toHaveLength(2));
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls.every(([url]) => /\/api\/chat\/stream$/.test(url))).toBe(true);
});

it("falls back to /api/chat after a 503 from the stream", async () => {
  const fetch = vi.fn()
    .mockResolvedValueOnce({ ok: false, status: 503, body: null })
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ reply: "Fallback answer" }) });
  vi.stubGlobal("fetch", fetch);
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  expect(await screen.findByText("Fallback answer", { selector: "p" })).toBeVisible();
  expect(fetch.mock.calls[1][0]).toMatch(/\/api\/chat$/);
});

it("keeps partial text and reports interruption without automatically resubmitting", async () => {
  const read = vi.fn()
    .mockResolvedValueOnce({ done: false, value: encoder.encode('data: {"type":"chunk","text":"Partial answer"}\n\n') })
    .mockResolvedValueOnce({ done: true });
  const fetch = vi.fn().mockResolvedValue({ ok: true, body: { getReader: () => ({ read, cancel: async () => {} }) } });
  vi.stubGlobal("fetch", fetch);
  render(<StrictMode><ChatWidget /></StrictMode>);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  expect(await screen.findByText(/couldn't reach the assistant/)).toBeVisible();
  expect(screen.getByText("Partial answer")).toBeVisible();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("textbox")).toBeEnabled();
});

// A question that ended in an error bubble got no answer: sending it (and a
// cut-off reply) with later questions shows the model a conversation that
// never happened.
it("leaves failed questions and their partial replies out of later history", async () => {
  const sse = (...frames: string[]) => {
    const read = vi.fn();
    for (const f of frames) read.mockResolvedValueOnce({ done: false, value: encoder.encode(f) });
    read.mockResolvedValue({ done: true });
    return { ok: true, status: 200, body: { getReader: () => ({ read, cancel: async () => {} }) } };
  };
  const fetch = vi.fn()
    .mockResolvedValueOnce(sse('data: {"type":"done","text":"Answer one"}\n\n'))
    .mockResolvedValueOnce(sse('data: {"type":"chunk","text":"Cut off"}\n\n'))
    .mockRejectedValueOnce(new TypeError("offline"))
    .mockRejectedValueOnce(new TypeError("offline"))
    .mockResolvedValueOnce(sse('data: {"type":"done","text":"Answer four"}\n\n'));
  vi.stubGlobal("fetch", fetch);
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  const input = screen.getByRole("textbox");
  const ask = async (q: string) => {
    await waitFor(() => expect(screen.getByRole("textbox")).toBeEnabled());
    await waitFor(() => expect(screen.queryByText("Thinking…")).toBeNull());
    fireEvent.change(input, { target: { value: q } });
    fireEvent.submit(input.closest("form")!);
  };
  await ask("One");
  expect(await screen.findByText("Answer one", { selector: "p" })).toBeVisible();
  await ask("Two");
  expect(await screen.findByText("Cut off", { selector: "p" })).toBeVisible();
  await waitFor(() => expect(screen.getAllByText(/couldn't reach the assistant/, { selector: ".msg-txt" })).toHaveLength(1));
  await ask("Three");
  await waitFor(() => expect(screen.getAllByText(/couldn't reach the assistant/, { selector: ".msg-txt" })).toHaveLength(2));
  await ask("Four");
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(5));
  expect(JSON.parse(fetch.mock.calls[4][1].body).history).toEqual([
    { role: "user", content: "One" },
    { role: "model", content: "Answer one" },
  ]);
});

it("closes on Escape and hands focus back to the launcher", async () => {
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  expect(screen.getByRole("dialog", { name: "Ask about Arda" })).toBeInTheDocument();
  expect(screen.getByRole("log")).toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(screen.getByRole("button", { name: "Ask about Arda" })).toHaveFocus());
});

it("hands focus back to the control that opened it, such as the hero's ask button", async () => {
  const ask = document.createElement("button");
  ask.textContent = "ask ▸";
  ask.addEventListener("click", () => openChat());
  document.body.append(ask);
  render(<ChatWidget />);
  ask.focus();
  fireEvent.click(ask);
  await waitFor(() => expect(screen.getByRole("textbox")).toHaveFocus());
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  await waitFor(() => expect(ask).toHaveFocus());

  // Gone by the time the chat closes: the launcher takes focus instead.
  ask.focus();
  fireEvent.click(ask);
  ask.remove();
  fireEvent.keyDown(document, { key: "Escape" });
  await waitFor(() => expect(screen.getByRole("button", { name: "Ask about Arda" })).toHaveFocus());
});

it("keeps the input usable and focused while a reply is on its way", async () => {
  // A disabled input loses keyboard focus (Chromium moves it to <body>) and
  // nothing hands it back, so every question cost the visitor their place.
  let emit: (value: { done: boolean; value?: Uint8Array }) => void;
  const read = vi.fn(() => new Promise((resolve) => { emit = resolve; }));
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, body: { getReader: () => ({ read, cancel: async () => {} }) } }));
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  const input = screen.getByRole("textbox");
  await waitFor(() => expect(input).toHaveFocus());
  fireEvent.change(input, { target: { value: "First question" } });
  fireEvent.submit(input.closest("form")!);
  await waitFor(() => expect(read).toHaveBeenCalledTimes(1));

  expect(input).toBeEnabled();
  expect(input).toHaveFocus();
  // Busy still guards sending: typing ahead is fine, a second request is not.
  fireEvent.change(input, { target: { value: "Second question" } });
  expect(screen.getByRole("button", { name: "Send (enter)" })).toBeDisabled();
  fireEvent.submit(input.closest("form")!);
  expect(fetch).toHaveBeenCalledTimes(1);

  emit!({ done: false, value: encoder.encode('data: {"type":"done","text":"Answer"}\n\n') });
  expect(await screen.findByText("Answer", { selector: "p" })).toBeVisible();
  expect(input).toHaveFocus();
  expect(input).toHaveValue("Second question");
});

// The visible log is not a live region: it changes on every chunk, and an
// aria-busy that flips back to false changes no text, so some screen readers
// never read the reply. One hidden status node gets the finished reply's plain
// text once, and is cleared when the next question is sent.
it("announces each finished reply once, as plain text, through a status node", async () => {
  let emit: (value: { done: boolean; value?: Uint8Array }) => void;
  const read = vi.fn(() => new Promise((resolve) => { emit = resolve; }));
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, body: { getReader: () => ({ read, cancel: async () => {} }) } }));
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  const log = screen.getByRole("log");
  expect(log).toHaveAttribute("aria-live", "off");
  expect(log).not.toHaveAttribute("aria-busy");
  const status = screen.getByRole("status");
  expect(status).toHaveTextContent(/^$/);
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  await waitFor(() => expect(read).toHaveBeenCalledTimes(1));

  emit!({ done: false, value: encoder.encode('data: {"type":"chunk","text":"Half an"}\n\n') });
  expect(await screen.findByText("Half an")).toBeVisible();
  expect(status).toHaveTextContent(/^$/);

  await waitFor(() => expect(read).toHaveBeenCalledTimes(2));
  emit!({ done: false, value: encoder.encode('data: {"type":"done","text":"Half an **answer** with [a link](https://x.y)."}\n\n') });
  await waitFor(() => expect(status).toHaveTextContent(/^Half an answer with a link\.$/));

  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "Again" } });
  fireEvent.submit(input.closest("form")!);
  expect(status).toHaveTextContent(/^$/);
});

// A live region only speaks when its text changes while it is on the page:
// one inserted with text already in it is not read. So the status node lives
// as long as the widget, and a reply that finishes while the chat is closed
// is announced when it reopens.
it("announces a reply that finished while the chat was closed when it reopens", async () => {
  let emit: (value: { done: boolean; value?: Uint8Array }) => void;
  const read = vi.fn(() => new Promise((resolve) => { emit = resolve; }));
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, body: { getReader: () => ({ read, cancel: async () => {} }) } }));
  render(<ChatWidget />);
  const status = screen.getByRole("status");
  expect(status).toHaveTextContent(/^$/);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  await waitFor(() => expect(read).toHaveBeenCalledTimes(1));
  fireEvent.keyDown(document, { key: "Escape" });
  await act(async () => {
    emit!({ done: false, value: encoder.encode('data: {"type":"done","text":"Answered while closed"}\n\n') });
    await new Promise((r) => setTimeout(r, 0));
  });
  expect(screen.getByRole("status")).toBe(status);
  expect(status).toHaveTextContent(/^$/);

  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  await waitFor(() => expect(status).toHaveTextContent(/^Answered while closed$/));
  expect(screen.getByRole("status")).toBe(status);
});

it("announces a failed reply's error", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/couldn't reach the assistant/));
});

// The bot rejects a message over 20,000 characters with a 400, which the
// widget can only show as a connection error; the input stops there instead.
it("caps the question at the length the bot accepts", () => {
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "20000");
});

// Without voice the reply streams in as it arrives; an opened ** or ` must not
// show as raw markers until its closing half turns up in a later chunk.
it("closes open markers in the reply that is still streaming", async () => {
  let emit: (value: { done: boolean; value?: Uint8Array }) => void;
  const read = vi.fn(() => new Promise((resolve) => { emit = resolve; }));
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, body: { getReader: () => ({ read, cancel: async () => {} }) } }));
  const { container } = render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  await waitFor(() => expect(read).toHaveBeenCalledTimes(1));
  emit!({ done: false, value: encoder.encode('data: {"type":"chunk","text":"He builds **golem and `rust_on"}\n\n') });
  const last = () => [...container.querySelectorAll(".msg-txt")].at(-1)!;
  await waitFor(() => expect(last().querySelector("strong > code")).toHaveTextContent(/^rust_on$/));
  expect(last().querySelector("strong")).toHaveTextContent(/^golem and rust_on$/);
  expect(last().textContent).not.toMatch(/[*`]/);

  await waitFor(() => expect(read).toHaveBeenCalledTimes(2));
  // The finished reply is shown as written: nothing is closed for it.
  emit!({ done: false, value: encoder.encode('data: {"type":"done","text":"2 ** 3"}\n\n') });
  expect(await screen.findByText("2 ** 3", { selector: "p" })).toBeVisible();
});

// jsdom has no layout: give the log a 1000px transcript in a 200px window.
function fakeLogScroll() {
  const tops = new WeakMap<Element, number>();
  const isLog = (el: Element) => el.classList.contains("chat-log");
  Object.defineProperties(HTMLElement.prototype, {
    scrollHeight: { configurable: true, get() { return isLog(this) ? 1000 : 0; } },
    clientHeight: { configurable: true, get() { return isLog(this) ? 200 : 0; } },
    scrollTop: {
      configurable: true,
      get() { return tops.get(this) ?? 0; },
      set(v: number) { tops.set(this, Math.max(0, Math.min(v, isLog(this) ? 800 : 0))); },
    },
  });
  return () => {
    for (const k of ["scrollHeight", "clientHeight", "scrollTop"]) delete (HTMLElement.prototype as unknown as Record<string, unknown>)[k];
  };
}

it("reopens at the latest message when a reply finished while it was closed", async () => {
  const restore = fakeLogScroll();
  try {
    let emit: (value: { done: boolean; value?: Uint8Array }) => void;
    const read = vi.fn(() => new Promise((resolve) => { emit = resolve; }));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, body: { getReader: () => ({ read, cancel: async () => {} }) } }));
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
    fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
    await waitFor(() => expect(read).toHaveBeenCalledTimes(1));
    fireEvent.keyDown(document, { key: "Escape" });
    // The reply lands while the panel is closed.
    await act(async () => {
      emit!({ done: false, value: encoder.encode('data: {"type":"done","text":"A long answer"}\n\n') });
      await new Promise((r) => setTimeout(r, 0));
    });
    fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
    expect(await screen.findByText("A long answer", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByRole("log").scrollTop).toBe(800);
  } finally {
    restore();
  }
});

it("does not pull a visitor who scrolled up back down, until they send", async () => {
  const restore = fakeLogScroll();
  try {
    let emit: (value: { done: boolean; value?: Uint8Array }) => void;
    const read = vi.fn(() => new Promise((resolve) => { emit = resolve; }));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, body: { getReader: () => ({ read, cancel: async () => {} }) } }));
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
    fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
    await waitFor(() => expect(read).toHaveBeenCalledTimes(1));
    const log = screen.getByRole("log");
    emit!({ done: false, value: encoder.encode('data: {"type":"chunk","text":"First words"}\n\n') });
    expect(await screen.findByText("First words")).toBeInTheDocument();
    expect(log.scrollTop).toBe(800);

    // Within 40px of the bottom still counts as following along.
    log.scrollTop = 770;
    fireEvent.scroll(log);
    await waitFor(() => expect(read).toHaveBeenCalledTimes(2));
    emit!({ done: false, value: encoder.encode('data: {"type":"chunk","text":" and more"}\n\n') });
    expect(await screen.findByText("First words and more")).toBeInTheDocument();
    expect(log.scrollTop).toBe(800);

    log.scrollTop = 100;
    fireEvent.scroll(log);
    await waitFor(() => expect(read).toHaveBeenCalledTimes(3));
    emit!({ done: false, value: encoder.encode('data: {"type":"done","text":"First words and more, done."}\n\n') });
    expect(await screen.findByText("First words and more, done.", { selector: "p" })).toBeInTheDocument();
    expect(log.scrollTop).toBe(100);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Next" } });
    fireEvent.submit(input.closest("form")!);
    await waitFor(() => expect(log.scrollTop).toBe(800));
  } finally {
    restore();
  }
});
