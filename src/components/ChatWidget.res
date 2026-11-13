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
let sendLabel = "Send (enter)" // contains the visible "enter ↵" (WCAG 2.5.3)
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
// onError(retry) if the stream fails. `retry` says whether the request most
// likely never reached the model, so /api/chat may be tried instead: a
// network error, a deadline or a dropped connection before any byte, HTTP 413
// or a 5xx. Any other HTTP error, an SSE `error` event and any failure after
// the first byte are final: a fallback would pay for the reply twice, or
// spend a rate-limited visitor's next slot.
// `extra` fields (the voice request, if any) are merged into the body, and
// every parsed event goes to onEvent (the speaker) before it is handled here.
// Aborts after 45s without data. SSE shape: `data: {"type":"thinking"|"chunk"|
// "done"|"error"|"voice"|"speech"|"speech_end", ...}`.
let postChatStream: (
  string,
  array<chatMsg>,
  string => unit,
  string => unit,
  bool => unit,
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
      timer = setTimeout(function () { controller.abort(); fail(!gotBytes); }, 45000);
    }
    arm();
    var settled = false;
    var gotBytes = false;
    var reader;
    function closeReader() {
      if (reader) {
        try { Promise.resolve(reader.cancel()).catch(function () {}); } catch (e) {}
      }
    }
    function fail(retry) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      closeReader();
      onError(!!retry);
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
        if (!res.ok) { fail(res.status === 413 || res.status >= 500); return; }
        if (!res.body) { fail(true); return; }
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
              if (r.value && r.value.byteLength > 0) { gotBytes = true; arm(); }
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
                fail(false);
                return;
              }
            }
            // EOF without completion is a failed request, even after partial text.
            if (r.done) { fail(!gotBytes); return; }
            return pump();
          });
        }
        return pump();
      })
      .catch(function () { fail(!gotBytes); });
  }
`)

let scrollToBottom: Dom.element => unit = %raw(`function (el) { if (el) el.scrollTop = el.scrollHeight; }`)
// Within about 40px of the bottom counts as following the conversation.
let nearBottom: Dom.element => bool = %raw(`function (el) { return el.scrollHeight - el.scrollTop - el.clientHeight <= 40; }`)
let focusEl: Dom.element => unit = %raw(`function (el) { if (el) el.focus(); }`)
// Focus `el` if it is still on the page, else `fallback`.
let focusBack: (Nullable.t<Dom.element>, Nullable.t<Dom.element>) => unit = %raw(`
  function (el, fallback) {
    if (el && el.isConnected && typeof el.focus === "function") el.focus();
    else if (fallback) fallback.focus();
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
// sharing React state — a tiny window-event bus. `opener` is the control that
// asked (focus goes back to it on close); without one, whatever has focus at
// dispatch. A mouse click does not always focus the button it hits.
let openChat: Nullable.t<Dom.element> => unit = %raw(`
  function (opener) {
    if (typeof window !== "undefined") {
      var el = opener || document.activeElement;
      if (el === document.body) el = null;
      window.dispatchEvent(new CustomEvent("arda:open-chat", { detail: { opener: el || null } }));
    }
  }
`)

let listenForOpen: (Nullable.t<Dom.element> => unit) => (unit => unit) = %raw(`
  function (cb) {
    function handler(e) { cb((e && e.detail && e.detail.opener) || null); }
    window.addEventListener("arda:open-chat", handler);
    return function () { window.removeEventListener("arda:open-chat", handler); };
  }
`)

// The conversation sent with a new question: every exchange that got an
// answer. A question whose reply ended in an error bubble (a total failure, or
// a reply cut off midway) is left out with its partial reply, so the model
// never sees an unanswered turn or a truncated one; error bubbles never go.
let answeredHistory = (messages: array<chatMsg>) => {
  let out = []
  let turn = ref([])
  let failed = ref(false)
  let flush = () => {
    if !failed.contents {
      out->Array.pushMany(turn.contents)
    }
    turn := []
    failed := false
  }
  messages->Array.forEach(m => {
    if m.role == "user" {
      flush()
    }
    if m.isError {
      failed := true
    } else {
      turn := Array.concat(turn.contents, [m])
    }
  })
  flush()
  out
}

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
            | Some(n) => Markdown.revealPrefix(msg.content, n)
            | None if live => Markdown.closeOpenMarks(msg.content)
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
  // What the hidden status node says: the last finished reply, once.
  let (announcement, setAnnouncement) = React.useState(() => "")
  let announcedRef = React.useRef(-1)
  let idRef = React.useRef(0)
  let listRef = React.useRef(Nullable.null)
  let inputRef = React.useRef(Nullable.null)
  let launcherRef = React.useRef(Nullable.null)
  // Where focus goes back to on close: the control that opened the chat (the
  // launcher, or the hero's `ask ▸`). Kept while the chat is open, so asking
  // again from inside it cannot replace it.
  let returnRef = React.useRef(Nullable.null)
  let openRef = React.useRef(false)
  let openFrom = opener => {
    if !openRef.current {
      openRef.current = true
      returnRef.current = opener
    }
    setIsOpen(_ => true)
  }
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

  // Keep the transcript pinned to the latest message / thinking indicator
  // while the visitor follows along (`followRef`: at the bottom when they last
  // scrolled, just sent a question, or (re)opened the panel). The key folds in
  // the last message's length and the voice's progress, so streaming and
  // spoken replies keep the view at the bottom, and `isOpen`, so a reply that
  // finished while the panel was closed is in view when it reopens.
  let followRef = React.useRef(true)
  let lastLen = switch messages->Array.get(Array.length(messages) - 1) {
  | Some(m) => String.length(m.content)
  | None => 0
  }
  React.useEffect1(() => {
    switch listRef.current->Nullable.toOption {
    | Some(el) if followRef.current => scrollToBottom(el)
    | _ => ()
    }
    None
  }, [
    (isOpen ? "open:" : "closed:") ++
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
  // returns focus to whatever opened the chat if it is still on the page, else
  // to the launcher (non-modal widget — restore focus, not trap).
  React.useEffect1(() => {
    if isOpen {
      openRef.current = true
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
          // It reopens at the latest message.
          followRef.current = true
          // Closing the widget silences it.
          stopSpeech()
          openRef.current = false
          focusBack(returnRef.current, launcherRef.current)
        },
      )
    } else {
      None
    }
  }, [isOpen])

  // Open when another part of the page requests it.
  React.useEffect0(() => Some(listenForOpen(openFrom)))

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
      let history = answeredHistory(messages)
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
      setAnnouncement(_ => "")
      // Asking brings the conversation back into view.
      followRef.current = true
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
        retry => {
          silence()
          if started.contents || !retry {
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

  // A reply is announced once it is whole: streamed to the end and, with
  // voice on, spoken to the end (or it failed). Its plain text goes to the
  // status node, which is cleared when the next question is sent. One that
  // finishes while the chat is closed waits until it reopens.
  React.useEffect1(() => {
    switch messages->Array.get(Array.length(messages) - 1) {
    | Some(m) if isOpen && !busy && liveId == -1 && m.role != "user" && m.id != announcedRef.current =>
      announcedRef.current = m.id
      setAnnouncement(_ => m.isError ? m.content : Markdown.plainText(m.content))
    | _ => ()
    }
    None
  }, [
    Int.toString(Array.length(messages)) ++
    ":" ++
    Int.toString(lastLen) ++
    ":" ++
    (busy ? "1" : "0") ++
    ":" ++
    Int.toString(liveId) ++
    (isOpen ? ":open" : ":closed"),
  ])

  <>
    // On the page for the widget's whole life, outside the panel: a live
    // region inserted with text already in it is not read out.
    <div role="status" className="sr-only"> {React.string(announcement)} </div>
    {isOpen
      ? React.null
      : <button
          ref={ReactDOM.Ref.domRef(launcherRef)}
          type_="button"
          onClick={e => openFrom(Nullable.make(ReactEvent.Mouse.currentTarget(e)->Obj.magic))}
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

          // The log changes on every chunk and voice step, so it is not a live
          // region; the status node announces each finished reply once.
          <div
            ref={ReactDOM.Ref.domRef(listRef)}
            role="log"
            ariaLive=#off
            onScroll={_ =>
              switch listRef.current->Nullable.toOption {
              | Some(el) => followRef.current = nearBottom(el)
              | None => ()
              }}
            className="chat-log">
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
              maxLength={20000}
              value={input}
              onChange={e => {
                let value = ReactEvent.Form.target(e)["value"]
                setInput(_ => value)
              }}
              placeholder={placeholder}
              ariaLabel={inputLabel}
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
