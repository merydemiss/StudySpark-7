import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";

import { speak } from "@/lib/tts-client";
import { Mic, Square, Play, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/voice")({
  head: () => ({ meta: [{ title: "Voice Broadcast — StudySpark" }] }),
  component: VoicePage,
});

const VOICES = [
  { id: "alloy", label: "Alloy — Neutral" },
  { id: "echo", label: "Echo — Warm" },
  { id: "fable", label: "Fable — Storyteller" },
  { id: "onyx", label: "Onyx — Deep" },
  { id: "nova", label: "Nova — Bright" },
  { id: "shimmer", label: "Shimmer — Soft" },
];

const PRESETS = [
  "Photosynthesis is the process by which plants use sunlight to convert carbon dioxide and water into glucose and oxygen.",
  "Newton's three laws of motion describe the relationship between a body and the forces acting upon it, and its motion in response to those forces.",
  "In probability, the law of large numbers states that as a sample size grows, its mean gets closer to the average of the whole population.",
];

function VoicePage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [speed, setSpeed] = useState(1.0);
  const [playing, setPlaying] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const start = async () => {
    const value = text.trim();
    if (!value) {
      toast.error("Type or paste something to read aloud");
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setPlaying(true);
    try {
      await speak({
        text: value,
        voice,
        speed,
        signal: ctrl.signal,
        onEnd: () => setPlaying(false),
      });
    } catch (err) {
      console.error(err);
      if (!ctrl.signal.aborted) toast.error("Voice broadcast failed");
      setPlaying(false);
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setPlaying(false);
  };

  return (
    
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-muted-foreground inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> AI Voice Broadcast
            </div>
            <h1 className="font-display mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              Listen to your study material
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
              Paste any passage and hear it narrated by an AI voice. Perfect for revising on the
              move, accessibility, or audio learners. Unlimited — no caps.
            </p>
          </div>
          <span className="bg-gradient-brand hidden h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-glow md:grid">
            <Mic className="h-6 w-6 text-primary-foreground" />
          </span>
        </header>

        <div className="shadow-card rounded-2xl border border-border bg-card p-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={9}
            placeholder="Paste a paragraph, definition, or set of notes…"
            className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => setText(p)}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full border border-border px-3 py-1 text-xs"
              >
                Example {i + 1}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted-foreground mb-1 block font-medium">Voice</span>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-muted-foreground mb-1 block font-medium">
                Speed — {speed.toFixed(2)}x
              </span>
              <input
                type="range"
                min={0.7}
                max={1.3}
                step={0.05}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {!playing ? (
              <button
                onClick={start}
                className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                <Play className="h-4 w-4" /> Read aloud
              </button>
            ) : (
              <button
                onClick={stop}
                className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground"
              >
                <Square className="h-4 w-4" /> Stop
              </button>
            )}
            {playing && (
              <span className="text-muted-foreground inline-flex items-center gap-2 text-xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Streaming audio…
              </span>
            )}
          </div>
        </div>
      </div>
    
  );
}
