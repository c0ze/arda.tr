import { StrictMode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { make as ChatWidget } from "@/components/ChatWidget.res.mjs";

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
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  expect(JSON.parse(fetch.mock.calls[1][1].body).history).toContainEqual({ role: "model", content: "Visible answer" });
  await waitFor(() => expect(read).toHaveBeenCalledTimes(3));
  emit!({ done: false, value: encoder.encode('data: {"type":"done","text":"Second answer"}\n\n') });
  expect(await screen.findByText("Second answer")).toBeVisible();
});

it("uses the fallback when streaming ends without a reply", async () => {
  const fetch = vi.fn()
    .mockResolvedValueOnce({ ok: true, body: { getReader: () => ({ read: async () => ({ done: true }), cancel: async () => {} }) } })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ reply: "Fallback answer" }) });
  vi.stubGlobal("fetch", fetch);
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  fireEvent.click(screen.getByRole("button", { name: "What does Arda build?" }));
  expect(await screen.findByText("Fallback answer")).toBeVisible();
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch.mock.calls[1][0]).toMatch(/\/api\/chat$/);
  expect(screen.getByRole("textbox")).toBeEnabled();
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

it("closes on Escape and hands focus back to the launcher", async () => {
  render(<ChatWidget />);
  fireEvent.click(screen.getByRole("button", { name: "Ask about Arda" }));
  expect(screen.getByRole("dialog", { name: "Ask about Arda" })).toBeInTheDocument();
  expect(screen.getByRole("log")).toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(screen.getByRole("button", { name: "Ask about Arda" })).toHaveFocus());
});
