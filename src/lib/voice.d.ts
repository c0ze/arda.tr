/* Types for voice.js (the family's shared spoken-reply client, vendored verbatim). */

/** Every parsed SSE event from /api/chat/stream; the speaker ignores what it does not need. */
export interface StreamEvent {
  type: string;
  [key: string]: unknown;
}

export interface SpeakerOptions {
  /** How much of the raw reply (UTF-16 units) may be shown; Infinity = all of it. Only ever grows. */
  onReveal?: (offset: number) => void;
  /** 0..1 loudness each animation frame while speaking. */
  onLevel?: (level: number) => void;
  /** Once, when the speaker has nothing more to do (always after onReveal(Infinity)). */
  onEnd?: () => void;
}

export interface Speaker {
  /** Feed every parsed SSE event (thinking/voice/chunk/speech/speech_end/done/error). */
  handle(event: StreamEvent): void;
  /** Silence it and reveal everything. */
  stop(): void;
}

export interface RobotChain {
  input: AudioNode;
  output: AnalyserNode;
  analyser: AnalyserNode;
}

export function unlockAudio(): AudioContext | null;
export function voiceEnabled(): boolean;
export function setVoiceEnabled(on: boolean): void;
export function onVoiceChange(fn: (on: boolean) => void): () => boolean;
export function requestFields(lang: string): { voice: true; lang: string } | Record<string, never>;
export function createSpeaker(opts?: SpeakerOptions): Speaker;
export function robotChain(ctx: BaseAudioContext): RobotChain;
