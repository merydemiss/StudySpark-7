import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import type { Database } from "@/integrations/supabase/types";

type ChatRequestBody = {
  messages?: UIMessage[];
  threadId?: string;
  difficulty?: "simple" | "standard" | "advanced";
};

const difficultyPrompt: Record<string, string> = {
  simple: "Explain like the student is 10 years old. Use very short sentences, friendly analogies, and avoid jargon.",
  standard: "Explain clearly for a high-school or early-college student. Define key terms and give one concrete example.",
  advanced: "Explain at a university level. Be precise, use proper terminology, and include nuance and edge cases.",
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const messages = body.messages;
        const threadId = body.threadId;
        const difficulty = body.difficulty ?? "standard";

        if (!Array.isArray(messages) || !threadId) {
          return new Response("Bad request", { status: 400 });
        }

        const auth = request.headers.get("authorization");
        if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
        const token = auth.slice(7);

        const url = process.env.SUPABASE_URL!;
        const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const lovableKey = process.env.LOVABLE_API_KEY;
        if (!lovableKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const supabase = createClient<Database>(url, key, {
          global: {
            fetch: (input, init) => {
              const headers = new Headers(init?.headers);
              headers.set("apikey", key);
              headers.set("Authorization", `Bearer ${token}`);
              return fetch(input, { ...init, headers });
            },
          },
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
        });

        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userData.user) return new Response("Unauthorized", { status: 401 });
        const userId = userData.user.id;

        // Verify thread ownership
        const { data: thread } = await supabase
          .from("chat_threads")
          .select("id, title")
          .eq("id", threadId)
          .eq("user_id", userId)
          .maybeSingle();
        if (!thread) return new Response("Thread not found", { status: 404 });

        // Save the latest user message
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        if (lastUser) {
          await supabase.from("chat_messages").insert({
            thread_id: threadId,
            user_id: userId,
            role: "user",
            parts: lastUser.parts as never,
          });
          // Auto-title from first user message
          if (thread.title === "New chat") {
            const text = lastUser.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join(" ")
              .slice(0, 60);
            if (text) {
              await supabase.from("chat_threads").update({ title: text }).eq("id", threadId);
            }
          }
        }

        const gateway = createLovableAiGatewayProvider(lovableKey);

        const modelMessages = await convertToModelMessages(messages);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system:
            "You are StudySpark, a friendly AI study tutor for students. " +
            "You explain math, science, history, languages, and general subjects. " +
            "Use markdown: short headings, bullet points, bold key terms, and KaTeX-style math when relevant. " +
            "Stay encouraging and clear. " +
            difficultyPrompt[difficulty],
          messages: modelMessages,
          onFinish: async ({ text }) => {
            await supabase.from("chat_messages").insert({
              thread_id: threadId,
              user_id: userId,
              role: "assistant",
              parts: [{ type: "text", text }] as never,
            });
            await supabase
              .from("chat_threads")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", threadId);
          },
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
