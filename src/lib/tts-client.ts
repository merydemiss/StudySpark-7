import { createParser } from "eventsource-parser";

export function chunkForTTS(text: string, maxWords = 300): string[] {
  const wordCount = (s: string) => (s.match(/\S+/g) ?? []).length;
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = "";
  };
  for (const sentence of sentences) {
    if (wordCount(sentence) > maxWords) {
      flush();
      const words = sentence.match(/\S+/g) ?? [];
      for (let i = 0; i < words.length; i += maxWords) {
        chunks.push(words.slice(i, i + maxWords).join(" "));
      }
      continue;
    }
    if (current && wordCount(current) + wordCount(sentence) > maxWords) flush();
    current += sentence;
  }
  flush();
  return chunks;
}

export type SpeakOptions = {
  text: string;
  voice?: string;
  speed?: number;
  signal?: AbortSignal;
  onStart?: () => void;
  onEnd?: () => void;
};

export async function speak(opts: SpeakOptions): Promise<void> {
  const chunks = chunkForTTS(opts.text);
  if (chunks.length === 0) return;
  const AudioCtx =
    (window.AudioContext as typeof AudioContext) ||
    ((window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext as typeof AudioContext);
  const ctx = new AudioCtx({ sampleRate: 24000 });
  if (ctx.state === "suspended") await ctx.resume().catch(() => {});
  let playhead = 0;
  let pending = new Uint8Array(0);
  let started = false;

  const playChunk = (incoming: Uint8Array) => {
    const bytes = new Uint8Array(pending.length + incoming.length);
    bytes.set(pending);
    bytes.set(incoming, pending.length);
    const usable = bytes.length - (bytes.length % 2);
    pending = bytes.slice(usable);
    if (usable === 0) return;
    const samples = new Int16Array(bytes.buffer.slice(0, usable));
    const floats = Float32Array.from(samples, (s) => s / 32768);
    const buffer = ctx.createBuffer(1, floats.length, 24000);
    buffer.copyToChannel(floats, 0);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    if (playhead === 0) playhead = ctx.currentTime + 0.05;
    else playhead = Math.max(playhead, ctx.currentTime);
    source.start(playhead);
    playhead += buffer.duration;
    if (!started) {
      started = true;
      opts.onStart?.();
    }
  };

  try {
    for (const chunk of chunks) {
      if (opts.signal?.aborted) break;
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: chunk, voice: opts.voice, speed: opts.speed }),
        signal: opts.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error(`TTS failed: ${res.status} ${await res.text().catch(() => "")}`);
      }
      const parser = createParser({
        onEvent(event) {
          let payload: { type: string; audio?: string };
          try {
            payload = JSON.parse(event.data);
          } catch {
            return;
          }
          if (payload.type !== "speech.audio.delta" || !payload.audio) return;
          const binary = atob(payload.audio);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          playChunk(bytes);
        },
      });
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        parser.feed(value);
      }
    }
    // wait until scheduled audio finishes
    const remaining = Math.max(0, playhead - ctx.currentTime);
    await new Promise((r) => setTimeout(r, remaining * 1000 + 100));
  } finally {
    opts.onEnd?.();
    ctx.close().catch(() => {});
  }
}
