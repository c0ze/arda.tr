/* Bindings to src/lib/voice.js — the construct's spoken replies (vendored verbatim
   from design-previews/onebit/voice.js; do not fork). See that file's header for
   the SSE protocol. */

type speaker

type speakerOptions = {
  // How much of the raw reply may be shown (UTF-16 units); Infinity = all of it.
  onReveal: float => unit,
  // 0..1 loudness each animation frame while speaking.
  onLevel: float => unit,
  // Once, when the speaker has nothing more to do (always after onReveal(Infinity)).
  onEnd: unit => unit,
}

// Call inside the user's send gesture; browsers refuse audio started elsewhere.
@module("@/lib/voice.js") external unlockAudio: unit => unit = "unlockAudio"
@module("@/lib/voice.js") external voiceEnabled: unit => bool = "voiceEnabled"
@module("@/lib/voice.js") external setVoiceEnabled: bool => unit = "setVoiceEnabled"
// Returns an unsubscribe function.
@module("@/lib/voice.js") external onVoiceChange: (bool => unit) => (unit => unit) = "onVoiceChange"
// {voice: true, lang} when voice is on, else {}: spread into the request body.
@module("@/lib/voice.js") external requestFields: string => Dict.t<JSON.t> = "requestFields"
@module("@/lib/voice.js") external createSpeaker: speakerOptions => speaker = "createSpeaker"

// Feed every parsed SSE event.
@send external handle: (speaker, JSON.t) => unit = "handle"
// Silence it and reveal everything.
@send external stop: speaker => unit = "stop"
