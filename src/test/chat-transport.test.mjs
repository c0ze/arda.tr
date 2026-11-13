import { test } from 'vitest';
import assert from 'node:assert/strict';
import source from '../components/ChatWidget.res.mjs?raw';
import vm from 'node:vm';
import { TextDecoder, TextEncoder } from 'node:util';

// Exercise the compiled transport boundary without importing the page or making network calls.
const start = source.search(/(?:var|let|const) postChat =/);
const end = source.search(/(?:var|let|const) scrollToBottom =/);
assert.ok(start >= 0 && end > start, 'compiled chat transport boundaries must exist');
const transport = source.slice(start, end) + '\nthis.postChat = postChat; this.postChatStream = postChatStream;';

async function request(parts, { method = 'postChatStream', ok = true, status = ok ? 200 : 500, timeout = false, offline = false, extra, onEvent } = {}) {
  const events = [];
  let body;
  let cancelled = 0;
  let deadline;
  let signal;
  const reader = {
    async read() {
      return parts.length ? { done: false, value: new TextEncoder().encode(parts.shift()) } : { done: true };
    },
    async cancel() { cancelled++; },
  };
  const context = vm.createContext({
    TextDecoder, AbortController,
    setTimeout(fn) { deadline = fn; return 1; },
    clearTimeout() {},
    fetch(_url, options) {
      signal = options.signal;
      body = JSON.parse(options.body);
      if (offline) return Promise.reject(new TypeError('Failed to fetch'));
      if (timeout) return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(new Error('aborted')));
        queueMicrotask(() => deadline());
      });
      return Promise.resolve({ ok, status, body: { getReader: () => reader }, json: async () => ({ reply: 'untrusted error body' }) });
    },
  });
  vm.runInContext(transport, context);
  await new Promise((resolve) => {
    const done = (text) => { events.push(['done', text]); resolve(); };
    // postChatStream says whether the failure may fall back to /api/chat.
    const error = (retry) => { events.push(retry === undefined ? ['error'] : ['error', retry]); resolve(); };
    if (method === 'postChat') context.postChat('hello', [], done, error);
    else context.postChatStream('hello', [], (text) => events.push(['chunk', text]), done, error, extra, onEvent);
  });
  await new Promise((resolve) => setImmediate(resolve));
  return { events, cancelled, signal, body };
}

test('empty stream reports failure instead of inserting an empty reply', async () => {
  assert.deepEqual((await request([])).events, [['error', true]]);
});

test('interrupted reply reports failure after preserving its received text', async () => {
  assert.deepEqual((await request(['data: {"type":"chunk","text":"partial"}\n\n'])).events,
    [['chunk', 'partial'], ['error', false]]);
});

test('completion closes the reader and ignores following events', async () => {
  const result = await request(['data: {"type":"done","text":"complete"}\n\ndata: {"type":"chunk","text":"stale"}\n\n']);
  assert.deepEqual(result.events, [['done', 'complete']]);
  assert.equal(result.cancelled, 1);
});

test('server error closes the reader', async () => {
  const result = await request(['data: {"type":"error","message":"failed"}\n\n']);
  assert.deepEqual(result.events, [['error', false]]);
  assert.equal(result.cancelled, 1);
});

test('fragmented CRLF and multiline data produce the complete reply', async () => {
  const result = await request(['data:{"type":"chunk",\r\ndata: "text":"hello"}\r', '\n\r\ndata: {"type":"done","text":"hello!"}\r\n\r\n']);
  assert.deepEqual(result.events, [['chunk', 'hello'], ['done', 'hello!']]);
});

test('malformed payloads cannot prevent a later valid completion', async () => {
  const result = await request(['data: null\n\ndata: {"type":"done","text":42}\n\ndata: {"type":"done","text":"valid"}\n\n']);
  assert.deepEqual(result.events, [['done', 'valid']]);
});

test('unterminated final event is not accepted as completion', async () => {
  assert.deepEqual((await request(['data: {"type":"done","text":"incomplete frame"}'])).events, [['error', false]]);
});

test('deadline aborts a stalled request and reports failure once', async () => {
  const result = await request([], { timeout: true });
  assert.deepEqual(result.events, [['error', true]]);
  assert.equal(result.signal.aborted, true);
});

test('non-streaming fallback rejects an HTTP error even if it contains reply text', async () => {
  assert.deepEqual((await request([], { method: 'postChat', ok: false })).events, [['error']]);
});

test('without extra fields the body is exactly the text-only request', async () => {
  const result = await request(['data: {"type":"done","text":"ok"}\n\n']);
  assert.deepEqual(result.body, { message: 'hello', history: [] });
});

test('voice fields are merged into the body and every event reaches onEvent before completion', async () => {
  const seen = [];
  const result = await request([
    'data: {"type":"thinking"}\n\n',
    'data: {"type":"voice","on":true}\n\ndata: {"type":"chunk","text":"Hi."}\n\n',
    'data: {"type":"speech","seq":0,"start":0,"end":3,"audio":null,"marks":[]}\n\n',
    'data: {"type":"speech_end","upto":3}\n\ndata: {"type":"done","text":"Hi."}\n\n',
  ], { extra: { voice: true, lang: 'en' }, onEvent: (e) => seen.push(e.type) });
  assert.deepEqual(result.body, { message: 'hello', history: [], voice: true, lang: 'en' });
  assert.deepEqual(seen, ['thinking', 'voice', 'chunk', 'speech', 'speech_end', 'done']);
  assert.deepEqual(result.events, [['chunk', 'Hi.'], ['done', 'Hi.']]);
});

test('a throwing onEvent cannot break the stream', async () => {
  const result = await request(['data: {"type":"chunk","text":"a"}\n\ndata: {"type":"done","text":"a"}\n\n'],
    { onEvent: () => { throw new Error('boom'); } });
  assert.deepEqual(result.events, [['chunk', 'a'], ['done', 'a']]);
});

// A fallback is a second paid request: it is only for failures where the
// stream request most likely never reached the model.
test('falls back only on a network error, 413 or a 5xx before any byte', async () => {
  assert.deepEqual((await request([], { offline: true })).events, [['error', true]]);
  for (const status of [413, 500, 502, 503]) {
    assert.deepEqual((await request([], { ok: false, status })).events, [['error', true]], `HTTP ${status}`);
  }
});

test('treats other HTTP errors as final: no second request for a blocked or rate-limited visitor', async () => {
  for (const status of [400, 401, 403, 404, 415, 429]) {
    assert.deepEqual((await request([], { ok: false, status })).events, [['error', false]], `HTTP ${status}`);
  }
});

test('an SSE error event before any text is final', async () => {
  const result = await request(['data: {"type":"thinking"}\n\ndata: {"type":"error","message":"blocked"}\n\n']);
  assert.deepEqual(result.events, [['error', false]]);
});

test('once the server has answered with bytes, a broken or stalled stream is final', async () => {
  const context = vm.createContext({
    TextDecoder, AbortController, setTimeout: (fn) => { context.deadline = fn; return 1; }, clearTimeout() {},
    fetch: (_url, options) => {
      let calls = 0;
      const reader = {
        read() {
          calls++;
          if (calls === 1) return Promise.resolve({ done: false, value: new TextEncoder().encode('data: {"type":"thinking"}\n\n') });
          if (context.mode === 'reset') return Promise.reject(new TypeError('network error'));
          return new Promise((_r, reject) => options.signal.addEventListener('abort', () => reject(new Error('aborted'))));
        },
        cancel: async () => {},
      };
      return Promise.resolve({ ok: true, status: 200, body: { getReader: () => reader } });
    },
  });
  vm.runInContext(transport, context);
  for (const mode of ['reset', 'stall']) {
    context.mode = mode;
    const retry = await new Promise((resolve) => {
      context.postChatStream('hello', [], () => {}, () => resolve('done'), resolve, {}, undefined);
      if (mode === 'stall') setTimeout(() => context.deadline(), 5);
    });
    assert.equal(retry, false, mode);
  }
});

test('a broken connection before any byte may fall back', async () => {
  const context = vm.createContext({
    TextDecoder, AbortController, setTimeout: () => 1, clearTimeout() {},
    fetch: () => Promise.resolve({ ok: true, status: 200, body: { getReader: () => ({ read: () => Promise.reject(new TypeError('network error')), cancel: async () => {} }) } }),
  });
  vm.runInContext(transport, context);
  const retry = await new Promise((resolve) => context.postChatStream('hello', [], () => {}, () => resolve('done'), resolve, {}, undefined));
  assert.equal(retry, true);
});

