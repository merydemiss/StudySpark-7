import { createFileRoute } from "@tanstack/react-router";

type Body = {
  text?: string;
  voice?: string;
  speed?: number;
  instructions?: string;
};

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        const text = (body.text ?? "").trim();
        if (!text) return new Response("Missing text", { status: 400 });
        if (text.length > 4000) {
          return new Response("Text too long (max 4000 chars per chunk)", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        try {
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini-tts",
              input: text,
              voice: body.voice ?? "alloy",
              speed: body.speed ?? 1.0,
              instructions: body.instructions,
              stream_format: "sse",
              response_format: "pcm",
            }),
            signal: request.signal,
          });
          if (!upstream.ok || !upstream.body) {
            const errText = await upstream.text().catch(() => "");
            return new Response(errText || "TTS failed", { status: upstream.status });
          }
          return new Response(upstream.body, {
            headers: { "Content-Type": "text/event-stream" },
          });
        } catch (err) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          throw err;
        }
      },
    },
  },
});
