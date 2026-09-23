// Floating "Ask about Arda" helpdesk widget. A launcher opens a One Bit chat
// panel — a revolving orb that sizzles on every streamed chunk, a crackling
// cursor trailing the reply — that streams from the ai.arda.tr bot's SSE
// /api/chat/stream (Gemini; the server holds the key) and renders Markdown.
// Falls back to non-streaming /api/chat. SSR-safe: the network call only runs
// in event handlers, and the panel only mounts after a click. Requires the
// bot's CORS ALLOWED_ORIGINS to include this origin (https://arda.tr).
//
// Voice: unless muted (the ♪ toggle in the header, persisted site-wide by
// src/lib/voice.js), requests ask for speech too. One speaker per reply plays
// it through the robot filter and says how far the voice has got; the reply
// shows only that far (the crackle cursor trailing it), and the voice's
// loudness makes the orb sizzle, as on ai.arda.tr.

let launcherLabel = "Ask about Arda"
let titleLabel = "Ask about Arda"
let closeLabel = "Close"
let greeting = "Arda's AI assistant. Ask about his work, projects or background."
let placeholder = "Ask a question…"
let sendLabel = "Send"
let thinkingLabel = "Thinking…"
let voiceLabel = "Voice"
let voiceTitle = "Read replies aloud"
let voiceOnText = "on"
let voiceOffText = "off"
let lang = "en"
let errorLabel = "I couldn't reach the assistant. Try again in a moment."
let suggestions = ["What does Arda build?", "Where has he worked?", "What's his background?"]
let botLabel = "construct"
let youLabel = "you"
let modelLabel = "ai · gemini"
let hintLabel = "answers can be wrong. check anything important."
let sendText = "enter ↵"
let inputLabel = "Your question"

type chatMsg = {
  id: int,
  role: string, // "user" | "model"
  content: string,
  isError: bool,
}

// POST the message + prior history; calls onReply(text) or onError(). Aborts
// after 30s so a hung request can't pin the widget in its busy state.
let postChat: (string, array<chatMsg>, string => unit, unit => unit) => unit = %raw(`
  function (message, history, onReply, onError) {
    var hist = (history || []).map(function (m) {
      return { role: m.role, content: m.content };
    });
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 30000);
    var done = false;
    function finish(fn, arg) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      fn(arg);
    }
    fetch("https://ai-arda-tr-api-599610058688.asia-northeast1.run.app/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, history: hist }),
      signal: controller.signal,
    })
      .then(function (r) {
        if (!r.ok) throw new Error("Chat request failed");
        return r.json();
      })
      .then(function (j) {
        if (j && typeof j.reply === "string" && j.reply.length > 0) {
          finish(onReply, j.reply);
        } else {
          finish(onError);
        }
      })
      .catch(function () { finish(onError); });
  }
`)

// Streaming variant: POSTs to the SSE /api/chat/stream endpoint and calls
// onChunk(fullTextSoFar) as tokens arrive, onDone(fullText) at the end, or
// onError() if the stream fails (caller falls back only before any token).
// `extra` fields (the voice request, if any) are merged into the body, and
// every parsed event goes to onEvent (the speaker) before it is handled here.
// Aborts after 45s without data. SSE shape: `data: {"type":"thinking"|"chunk"|
// "done"|"error"|"voice"|"speech"|"speech_end", ...}`.
let postChatStream: (
  string,
  array<chatMsg>,
  string => unit,
  string => unit,
  unit => unit,
  Dict.t<JSON.t>,
  JSON.t => unit,
) => unit = %raw(`
  function (message, history, onChunk, onDone, onError, extra, onEvent) {
    var hist = (history || []).map(function (m) {
      return { role: m.role, content: m.content };
    });
    var body = { message: message, history: hist };
    if (extra && typeof extra === "object") {
      for (var key in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, key)) body[key] = extra[key];
      }
    }
    var controller = new AbortController();
    var timer;
    // An inactivity deadline: a spoken reply streams for longer than a plain one.
    function arm() {
      clearTimeout(timer);
      timer = setTimeout(function () { controller.abort(); fail(); }, 45000);
    }
    arm();
    var settled = false;
    var reader;
    function closeReader() {
      if (reader) {
        try { Promise.resolve(reader.cancel()).catch(function () {}); } catch (e) {}
      }
    }
    function fail() {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      closeReader();
      onError();
    }
    function finish(full) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      closeReader();
      onDone(full);
    }
    fetch("https://ai-arda-tr-api-599610058688.asia-northeast1.run.app/api/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "text/event-stream" },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
      .then(function (res) {
        if (!res.ok || !res.body) { fail(); return; }
        reader = res.body.getReader();
        if (settled) { closeReader(); return; }
        var decoder = new TextDecoder();
        var buffer = "";
        var full = "";
        function pump() {
          return reader.read().then(function (r) {
            if (settled) return;
            if (r.done) {
              buffer += decoder.decode(); // flush any trailing multi-byte char
            } else {
              if (r.value && r.value.byteLength > 0) arm();
              buffer += decoder.decode(r.value, { stream: true });
            }
            // SSE events are blank-line separated; tolerate LF or CRLF framing.
            var events = buffer.split(/\r?\n\r?\n/);
            buffer = events.pop() || ""; // incomplete events are never dispatched
            for (var k = 0; k < events.length; k++) {
              var dataLines = events[k].split(/\r?\n/).filter(function (l) {
                return l.indexOf("data:") === 0;
              });
              if (dataLines.length === 0) continue;
              var payload = dataLines
                .map(function (l) { return l.slice(5).replace(/^ /, ""); })
                .join("\n");
              var obj;
              try { obj = JSON.parse(payload); } catch (e) { continue; }
              if (!obj || typeof obj !== "object") continue;
              if (typeof onEvent === "function" && typeof obj.type === "string") {
                try { onEvent(obj); } catch (e) {}
              }
              if (settled) return;
              if (obj.type === "chunk" && typeof obj.text === "string" && obj.text.length > 0) {
                full += obj.text;
                onChunk(full);
              } else if (obj.type === "done" && typeof obj.text === "string" && obj.text.length > 0) {
                full = obj.text;
                finish(full);
                return;
              } else if (obj.type === "error") {
                fail();
                return;
              }
            }
            // EOF without completion is a failed request, even after partial text.
            if (r.done) { fail(); return; }
            return pump();
          });
        }
        return pump();
      })
      .catch(function () { fail(); });
  }
`)

let scrollToBottom: Dom.element => unit = %raw(`function (el) { if (el) el.scrollTop = el.scrollHeight; }`)
let focusEl: Dom.element => unit = %raw(`function (el) { if (el) el.focus(); }`)

// The part of a reply the voice has reached, safe to hand to the Markdown
// renderer: never half a surrogate pair, a half-typed link shows as its label,
// and an open ** or ` is closed so the word being spoken is not framed by
// markers. `n` indexes the raw reply in UTF-16 units (JS string indices).
let revealPrefix: (string, int) => string = %raw(`
  function (text, n) {
    if (n < 0 || n >= text.length) return text;
    var s = text.slice(0, n);
    var last = s.charCodeAt(s.length - 1);
    if (last >= 0xd800 && last <= 0xdbff) s = s.slice(0, -1);
    s = s.replace(/\[([^\]\n]*)(\]\([^)\n]*)?$/, "$1");
    if ((s.match(/\*\*/g) || []).length % 2) s += "**";
    if ((s.match(/\`/g) || []).length % 2) s += "\`";
    return s;
  }
`)

let now: unit => float = %raw(`function () { return Date.now(); }`)

let onEscape: (unit => unit) => (unit => unit) = %raw(`
  function (close) {
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    return function () { document.removeEventListener("keydown", onKey); };
  }
`)

// Lets any other part of the page open the widget (e.g. a hero/nav CTA) without
// sharing React state — a tiny window-event bus.
let openChat: unit => unit = %raw(`
  function () {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("arda:open-chat"));
    }
  }
`)

let listenForOpen: (unit => unit) => (unit => unit) = %raw(`
  function (cb) {
    function handler() { cb(); }
    window.addEventListener("arda:open-chat", handler);
    return function () { window.removeEventListener("arda:open-chat", handler); };
  }
`)

// How far the voice has got through reply `id`: `shown` UTF-16 units of it.
type speech = {id: int, shown: int}

// Messages are labelled like a terminal transcript (`construct ▸` / `you ▸`),
// as on ai.arda.tr. `live` marks the reply that is still streaming or being
// spoken: it gets the crackling 1-bit cursor after its last word. `shown`
// limits a spoken reply to the part the voice has reached.
let bubble = (msg: chatMsg, ~live: bool, ~shown: option<int>) => {
  let isModel = msg.role != "user" && !msg.isError
  <div
    key={Int.toString(msg.id)}
    className={"msg " ++ (msg.role == "user" ? "you" : msg.isError ? "bot err" : "bot")}>
    <p className="msg-who">
      {React.string(msg.role == "user" ? youLabel : botLabel)}
      <span ariaHidden=true> {React.string(" ▸")} </span>
    </p>
    <div className="msg-txt">
      {isModel
        ? <Markdown
            text={switch shown {
            | Some(n) => revealPrefix(msg.content, n)
            | None => msg.content
            }}
            trailing=?{live ? Some(<OneBit.Crackle className="cursor" />) : None}
          />
        : React.string(msg.content)}
    </div>
  </div>
}

@react.component
let make = () => {
  let (isOpen, setIsOpen) = React.useState(() => false)
  let (input, setInput) = React.useState(() => "")
  let (messages, setMessages) = React.useState(() => [])
  let (busy, setBusy) = React.useState(() => false)
  let (streaming, setStreaming) = React.useState(() => false)
  let idRef = React.useRef(0)
  let listRef = React.useRef(Nullable.null)
  let inputRef = React.useRef(Nullable.null)
  let launcherRef = React.useRef(Nullable.null)
  // Voice: the visitor's choice (shared site-wide through voice.js), the
  // speaker for the reply being spoken, how far it has got and how loud it is.
  let (voiceOn, setVoiceOn) = React.useState(() => Voice.voiceEnabled())
  let (speech, setSpeech) = React.useState((): option<speech> => None)
  let (level, setLevel) = React.useState(() => 0.)
  let speakerRef: React.ref<Nullable.t<Voice.speaker>> = React.useRef(Nullable.null)
  let levelAtRef = React.useRef(0.)

  let nextId = () => {
    let id = idRef.current
    idRef.current = id + 1
    id
  }

  // Keep the transcript pinned to the latest message / thinking indicator. The
  // key folds in the last message's length so streaming updates (same message,
  // growing content) keep the view scrolled to the bottom.
  let lastLen = switch messages->Array.get(Array.length(messages) - 1) {
  | Some(m) => String.length(m.content)
  | None => 0
  }
  React.useEffect1(() => {
    switch listRef.current->Nullable.toOption {
    | Some(el) => scrollToBottom(el)
    | None => ()
    }
    None
  }, [
    Int.toString(Array.length(messages)) ++
    ":" ++
    Int.toString(lastLen) ++
    ":" ++
    (busy ? "1" : "0") ++
    ":" ++
    switch speech {
    | Some({shown}) => Int.toString(shown)
    | None => "-"
    },
  ])

  // Silence the reply being spoken (if any) and show all of it. Its own
  // callbacks are dropped from here on, so the state is settled here.
  let stopSpeech = () => {
    switch speakerRef.current->Nullable.toOption {
    | Some(s) =>
      speakerRef.current = Nullable.null
      Voice.stop(s)
    | None => ()
    }
    setSpeech(_ => None)
    setLevel(_ => 0.)
  }

  // One speaker per reply. Callbacks from a speaker that has since been
  // replaced or stopped are ignored.
  let beginSpeech = (modelId: int) => {
    let self = ref(None)
    let mine = () =>
      switch (self.contents, speakerRef.current->Nullable.toOption) {
      | (Some(a), Some(b)) => a === b
      | _ => false
      }
    let s = Voice.createSpeaker({
      onReveal: n =>
        if mine() {
          if n == Float.Constants.positiveInfinity {
            setSpeech(_ => None)
          } else {
            let shown = Float.toInt(n)
            setSpeech(_ => Some({id: modelId, shown}))
          }
        },
      onLevel: l =>
        if mine() {
          // ~9 sizzles a second, scaled by loudness: the orb's heat tracks the voice.
          if l < 0.03 {
            if levelAtRef.current > 0. {
              levelAtRef.current = 0.
              setLevel(_ => 0.)
            }
          } else if now() -. levelAtRef.current >= 110. {
            levelAtRef.current = now()
            setLevel(_ => l)
          }
        },
      onEnd: () =>
        if mine() {
          speakerRef.current = Nullable.null
          setSpeech(_ => None)
          setLevel(_ => 0.)
        },
    })
    self := Some(s)
    speakerRef.current = Nullable.make(s)
    s
  }

  // On open: focus the input and wire Escape-to-close. On close, the cleanup
  // returns focus to the launcher (non-modal widget — restore focus, not trap).
  React.useEffect1(() => {
    if isOpen {
      switch inputRef.current->Nullable.toOption {
      | Some(el) => focusEl(el)
      | None => ()
      }
      let removeEscape = onEscape(() => setIsOpen(_ => false))
      // Another page of the site may have muted or unmuted since.
      setVoiceOn(_ => Voice.voiceEnabled())
      Some(
        () => {
          removeEscape()
          // Closing the widget silences it.
          stopSpeech()
          switch launcherRef.current->Nullable.toOption {
          | Some(el) => focusEl(el)
          | None => ()
          }
        },
      )
    } else {
      None
    }
  }, [isOpen])

  // Open when another part of the page requests it.
  React.useEffect0(() => Some(listenForOpen(() => setIsOpen(_ => true))))

  // Follow the mute toggle (a muting speaker stops itself and reveals all).
  React.useEffect0(() => Some(Voice.onVoiceChange(on => setVoiceOn(_ => on))))

  // Unmounting silences it too.
  React.useEffect0(() => Some(
    () =>
      switch speakerRef.current->Nullable.toOption {
      | Some(s) =>
        speakerRef.current = Nullable.null
        Voice.stop(s)
      | None => ()
      },
  ))

  let submit = text => {
    let trimmed = String.trim(text)
    if trimmed !== "" && !busy {
      // Don't replay client-side error bubbles back to the model as history.
      let history = messages->Array.filter(m => !m.isError)
      let modelId = nextId()
      let started = ref(false)
      let addOrUpdate = full => {
        started := true
        setMessages(prev =>
          if prev->Array.some(m => m.id == modelId) {
            prev->Array.map(m => m.id == modelId ? {...m, content: full} : m)
          } else {
            Array.concat(prev, [{id: modelId, role: "model", content: full, isError: false}])
          }
        )
      }
      let userId = nextId()
      setMessages(prev =>
        Array.concat(prev, [{id: userId, role: "user", content: trimmed, isError: false}])
      )
      setInput(_ => "")
      setBusy(_ => true)
      setStreaming(_ => false)
      // A new question interrupts the previous reply's voice. Still inside the
      // send gesture (click / Enter / suggestion), so audio may start.
      stopSpeech()
      let speaker = if Voice.voiceEnabled() {
        Voice.unlockAudio()
        Some(beginSpeech(modelId))
      } else {
        None
      }
      let silence = () =>
        switch speaker {
        | Some(s) if speakerRef.current === Nullable.make(s) => stopSpeech()
        | _ => ()
        }
      postChatStream(
        trimmed,
        history,
        full => {
          if !started.contents {
            setStreaming(_ => true)
          }
          addOrUpdate(full)
        },
        full => {
          addOrUpdate(full)
          setStreaming(_ => false)
          setBusy(_ => false)
        },
        () => {
          silence()
          if started.contents {
            let errorId = nextId()
            setMessages(prev =>
              Array.concat(prev, [{id: errorId, role: "model", content: errorLabel, isError: true}])
            )
            setStreaming(_ => false)
            setBusy(_ => false)
          } else {
            postChat(
              trimmed,
              history,
              reply => {
                setMessages(prev =>
                  Array.concat(prev, [{id: modelId, role: "model", content: reply, isError: false}])
                )
                setBusy(_ => false)
              },
              () => {
                setMessages(prev =>
                  Array.concat(prev, [{id: modelId, role: "model", content: errorLabel, isError: true}])
                )
                setBusy(_ => false)
              },
            )
          }
        },
        Voice.requestFields(lang),
        event =>
          switch speaker {
          | Some(s) => Voice.handle(s, event)
          | None => ()
          },
      )
    }
  }

  let canSend = String.trim(input) !== "" && !busy
  // Changes on every streamed chunk (and on send), which makes the orb sizzle.
  let pulse = busy ? lastLen + Array.length(messages) : 0
  let liveId = switch (speech, streaming, messages->Array.get(Array.length(messages) - 1)) {
  | (Some({id}), _, _) => id
  | (None, true, Some(m)) if m.role != "user" => m.id
  | _ => -1
  }

  <>
    {isOpen
      ? React.null
      : <button
          ref={ReactDOM.Ref.domRef(launcherRef)}
          type_="button"
          onClick={_ => setIsOpen(_ => true)}
          ariaLabel={launcherLabel}
          ariaHaspopup=#dialog
          className="chat-launch">
          <OneBit.Orb size=20 />
          <span> {React.string(launcherLabel)} </span>
        </button>}
    {isOpen
      ? <div role="dialog" ariaLabel={titleLabel} className="chat">
          <div className="chat-head">
            <OneBit.Orb size=40 pulse level />
            <div>
              <p> {React.string(titleLabel)} </p>
              <p> {React.string(modelLabel)} </p>
            </div>
            // Mute / unmute the voice. The name stays "Voice"; aria-pressed
            // carries the state (on phones only the struck-through ♪ shows it).
            <button
              type_="button"
              onClick={_ => Voice.setVoiceEnabled(!voiceOn)}
              ariaLabel={voiceLabel}
              ariaPressed={voiceOn ? #"true" : #"false"}
              title={voiceTitle}
              className="chat-voice">
              <span className="voice-glyph" ariaHidden=true> {React.string("♪")} </span>
              <span className="voice-word" ariaHidden=true>
                {React.string(voiceOn ? voiceOnText : voiceOffText)}
              </span>
            </button>
            <button
              type_="button"
              onClick={_ => setIsOpen(_ => false)}
              ariaLabel={closeLabel}
              className="chat-x">
              {React.string("×")}
            </button>
          </div>

          <div ref={ReactDOM.Ref.domRef(listRef)} role="log" ariaLive=#polite className="chat-log">
            <div className="msg bot">
              <p className="msg-who">
                {React.string(botLabel)}
                <span ariaHidden=true> {React.string(" ▸")} </span>
              </p>
              <div className="msg-txt"> {React.string(greeting)} </div>
            </div>
            {Array.length(messages) == 0
              ? <div className="qp">
                  {suggestions
                  ->Array.mapWithIndex((s, i) =>
                    <button key={Int.toString(i)} type_="button" onClick={_ => submit(s)}>
                      <em ariaHidden=true> {React.string(Int.toString(i + 1))} </em>
                      {React.string(s)}
                    </button>
                  )
                  ->React.array}
                </div>
              : React.null}
            {messages
            ->Array.map(m =>
              bubble(
                m,
                ~live=m.id == liveId,
                ~shown=switch speech {
                | Some({id, shown}) if id == m.id => Some(shown)
                | _ => None
                },
              )
            )
            ->React.array}
            {busy && !streaming
              ? <div className="msg bot">
                  <p className="msg-who">
                    {React.string(botLabel)}
                    <span ariaHidden=true> {React.string(" ▸")} </span>
                  </p>
                  <div className="msg-txt">
                    <span className="sr-only"> {React.string(thinkingLabel)} </span>
                    <OneBit.Crackle className="cursor" />
                  </div>
                </div>
              : React.null}
          </div>

          <form
            onSubmit={e => {
              ReactEvent.Form.preventDefault(e)
              submit(input)
            }}
            className="chat-form">
            <b ariaHidden=true> {React.string("▸")} </b>
            <input
              ref={ReactDOM.Ref.domRef(inputRef)}
              type_="text"
              value={input}
              onChange={e => {
                let value = ReactEvent.Form.target(e)["value"]
                setInput(_ => value)
              }}
              placeholder={placeholder}
              ariaLabel={inputLabel}
              disabled={busy}
            />
            <button type_="submit" ariaLabel={sendLabel} disabled={!canSend} className="chat-send">
              {React.string(sendText)}
            </button>
          </form>
          <p className="chat-hint"> {React.string(hintLabel)} </p>
        </div>
      : React.null}
  </>
}
