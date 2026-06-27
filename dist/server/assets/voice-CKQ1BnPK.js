import { useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Loader2, Mic, Play, Sparkles, Square } from "lucide-react";
import { createParser } from "eventsource-parser";
//#region src/lib/tts-client.ts
function chunkForTTS(text, maxWords = 300) {
	const wordCount = (s) => (s.match(/\S+/g) ?? []).length;
	const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
	const chunks = [];
	let current = "";
	const flush = () => {
		if (current.trim()) chunks.push(current.trim());
		current = "";
	};
	for (const sentence of sentences) {
		if (wordCount(sentence) > maxWords) {
			flush();
			const words = sentence.match(/\S+/g) ?? [];
			for (let i = 0; i < words.length; i += maxWords) chunks.push(words.slice(i, i + maxWords).join(" "));
			continue;
		}
		if (current && wordCount(current) + wordCount(sentence) > maxWords) flush();
		current += sentence;
	}
	flush();
	return chunks;
}
async function speak(opts) {
	const chunks = chunkForTTS(opts.text);
	if (chunks.length === 0) return;
	const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24e3 });
	if (ctx.state === "suspended") await ctx.resume().catch(() => {});
	let playhead = 0;
	let pending = new Uint8Array(0);
	let started = false;
	const playChunk = (incoming) => {
		const bytes = new Uint8Array(pending.length + incoming.length);
		bytes.set(pending);
		bytes.set(incoming, pending.length);
		const usable = bytes.length - bytes.length % 2;
		pending = bytes.slice(usable);
		if (usable === 0) return;
		const samples = new Int16Array(bytes.buffer.slice(0, usable));
		const floats = Float32Array.from(samples, (s) => s / 32768);
		const buffer = ctx.createBuffer(1, floats.length, 24e3);
		buffer.copyToChannel(floats, 0);
		const source = ctx.createBufferSource();
		source.buffer = buffer;
		source.connect(ctx.destination);
		if (playhead === 0) playhead = ctx.currentTime + .05;
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
				body: JSON.stringify({
					text: chunk,
					voice: opts.voice,
					speed: opts.speed
				}),
				signal: opts.signal
			});
			if (!res.ok || !res.body) throw new Error(`TTS failed: ${res.status} ${await res.text().catch(() => "")}`);
			const parser = createParser({ onEvent(event) {
				let payload;
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
			} });
			const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				parser.feed(value);
			}
		}
		const remaining = Math.max(0, playhead - ctx.currentTime);
		await new Promise((r) => setTimeout(r, remaining * 1e3 + 100));
	} finally {
		opts.onEnd?.();
		ctx.close().catch(() => {});
	}
}
//#endregion
//#region src/routes/_authenticated/voice.tsx?tsr-split=component
var VOICES = [
	{
		id: "alloy",
		label: "Alloy — Neutral"
	},
	{
		id: "echo",
		label: "Echo — Warm"
	},
	{
		id: "fable",
		label: "Fable — Storyteller"
	},
	{
		id: "onyx",
		label: "Onyx — Deep"
	},
	{
		id: "nova",
		label: "Nova — Bright"
	},
	{
		id: "shimmer",
		label: "Shimmer — Soft"
	}
];
var PRESETS = [
	"Photosynthesis is the process by which plants use sunlight to convert carbon dioxide and water into glucose and oxygen.",
	"Newton's three laws of motion describe the relationship between a body and the forces acting upon it, and its motion in response to those forces.",
	"In probability, the law of large numbers states that as a sample size grows, its mean gets closer to the average of the whole population."
];
function VoicePage() {
	const [text, setText] = useState("");
	const [voice, setVoice] = useState("alloy");
	const [speed, setSpeed] = useState(1);
	const [playing, setPlaying] = useState(false);
	const abortRef = useRef(null);
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
				onEnd: () => setPlaying(false)
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
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8 md:py-12",
		children: [/* @__PURE__ */ jsxs("header", {
			className: "mb-6 flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-muted-foreground inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), " AI Voice Broadcast"]
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "font-display mt-1 text-3xl font-bold tracking-tight md:text-4xl",
					children: "Listen to your study material"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-muted-foreground mt-2 max-w-2xl text-sm",
					children: "Paste any passage and hear it narrated by an AI voice. Perfect for revising on the move, accessibility, or audio learners. Unlimited — no caps."
				})
			] }), /* @__PURE__ */ jsx("span", {
				className: "bg-gradient-brand hidden h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-glow md:grid",
				children: /* @__PURE__ */ jsx(Mic, { className: "h-6 w-6 text-primary-foreground" })
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "shadow-card rounded-2xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ jsx("textarea", {
					value: text,
					onChange: (e) => setText(e.target.value),
					rows: 9,
					placeholder: "Paste a paragraph, definition, or set of notes…",
					className: "w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: PRESETS.map((p, i) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setText(p),
						className: "text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full border border-border px-3 py-1 text-xs",
						children: ["Example ", i + 1]
					}, i))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-4 grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("label", {
						className: "block text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-muted-foreground mb-1 block font-medium",
							children: "Voice"
						}), /* @__PURE__ */ jsx("select", {
							value: voice,
							onChange: (e) => setVoice(e.target.value),
							className: "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm",
							children: VOICES.map((v) => /* @__PURE__ */ jsx("option", {
								value: v.id,
								children: v.label
							}, v.id))
						})]
					}), /* @__PURE__ */ jsxs("label", {
						className: "block text-sm",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-muted-foreground mb-1 block font-medium",
							children: [
								"Speed — ",
								speed.toFixed(2),
								"x"
							]
						}), /* @__PURE__ */ jsx("input", {
							type: "range",
							min: .7,
							max: 1.3,
							step: .05,
							value: speed,
							onChange: (e) => setSpeed(Number(e.target.value)),
							className: "w-full accent-primary"
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-5 flex flex-wrap items-center gap-3",
					children: [!playing ? /* @__PURE__ */ jsxs("button", {
						onClick: start,
						className: "bg-gradient-brand inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]",
						children: [/* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }), " Read aloud"]
					}) : /* @__PURE__ */ jsxs("button", {
						onClick: stop,
						className: "inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground",
						children: [/* @__PURE__ */ jsx(Square, { className: "h-4 w-4" }), " Stop"]
					}), playing && /* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground inline-flex items-center gap-2 text-xs",
						children: [/* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), " Streaming audio…"]
					})]
				})
			]
		})]
	});
}
//#endregion
export { VoicePage as component };
