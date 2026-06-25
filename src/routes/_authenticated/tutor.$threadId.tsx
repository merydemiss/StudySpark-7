import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getThreadMessages, updateThreadDifficulty } from "@/lib/threads.functions";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const Route = createFileRoute("/_authenticated/tutor/$threadId")({
  component: ChatPage,
});

const STARTERS = [
  "Explain the Pythagorean theorem with a real-life example",
  "Summarise the causes of World War I in 5 bullet points",
  "Quiz me on cell biology — 3 multiple-choice questions",
  "How do I solve quadratic equations? Step by step.",
];

function ChatPage() {
  const { threadId } = Route.useParams();
  const qc = useQueryClient();
  const getMsgs = useServerFn(getThreadMessages);
  const setDiff = useServerFn(updateThreadDifficulty);

  const initialQ = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => getMsgs({ data: { threadId } }),
  });

  return (
    <div className="flex h-full w-full flex-col">
      {initialQ.isLoading ? (
        <div className="grid flex-1 place-items-center text-muted-foreground">
          <Shimmer>Loading conversation…</Shimmer>
        </div>
      ) : initialQ.data ? (
        <ChatInner
          key={threadId}
          threadId={threadId}
          initialMessages={initialQ.data.rows.map((r) => ({
            id: r.id,
            role: r.role as UIMessage["role"],
            parts: r.parts as UIMessage["parts"],
          }))}
          initialDifficulty={initialQ.data.thread.difficulty as "simple" | "standard" | "advanced"}
          onDifficultyChange={async (d) => {
            await setDiff({ data: { id: threadId, difficulty: d } });
            qc.invalidateQueries({ queryKey: ["thread", threadId] });
          }}
        />
      ) : (
        <div className="grid flex-1 place-items-center text-muted-foreground">Chat not found.</div>
      )}
    </div>
  );
}

function ChatInner({
  threadId,
  initialMessages,
  initialDifficulty,
  onDifficultyChange,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  initialDifficulty: "simple" | "standard" | "advanced";
  onDifficultyChange: (d: "simple" | "standard" | "advanced") => Promise<void>;
}) {
  const qc = useQueryClient();
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [input, setInput] = useState("");

  const tokenRef = useRef<string | null>(null);
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      tokenRef.current = data.session?.access_token ?? null;
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      tokenRef.current = session?.access_token ?? null;
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: (): Record<string, string> => {
          const token = tokenRef.current;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
        body: () => ({ threadId, difficulty }),
      }),
    [threadId, difficulty],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onFinish: () => {
      qc.invalidateQueries({ queryKey: ["threads"] });
    },
  });

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const busy = status === "submitted" || status === "streaming";

  const submit = async (text: string) => {
    if (!text.trim() || busy) return;
    setInput("");
    await sendMessage({ text: text.trim() });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/60 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <BookOpen className="h-4 w-4 text-primary" /> Tutor session
        </div>
        <DifficultyPicker
          value={difficulty}
          onChange={(d) => {
            setDifficulty(d);
            void onDifficultyChange(d);
          }}
        />
      </div>

      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={
                <span className="bg-gradient-brand grid h-12 w-12 place-items-center rounded-2xl shadow-glow">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </span>
              }
              title="What can I help you study?"
              description="Ask anything, or try one of these starters."
            >
              <div className="mt-4 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-2xl border border-border bg-card p-3 text-left text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                return (
                  <Message key={m.id} from={m.role}>
                    {m.role === "user" ? (
                      <MessageContent>{text}</MessageContent>
                    ) : (
                      <div className="prose prose-sm max-w-none break-words text-foreground dark:prose-invert">
                        <MessageResponse>{text}</MessageResponse>
                      </div>
                    )}
                  </Message>
                );
              })}
              {status === "submitted" && (
                <div className="px-2 text-sm">
                  <Shimmer>Thinking…</Shimmer>
                </div>
              )}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background/80 p-3 backdrop-blur md:p-4">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            onSubmit={() => {
              void submit(input);
            }}
          >
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              autoFocus
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={!input.trim() || busy} />
            </PromptInputFooter>
          </PromptInput>
          {error && (
            <p className="mt-2 text-xs text-destructive">
              {error.message || "Something went wrong. Please try again."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DifficultyPicker({
  value,
  onChange,
}: {
  value: "simple" | "standard" | "advanced";
  onChange: (d: "simple" | "standard" | "advanced") => void;
}) {
  const opts = [
    { v: "simple", label: "Simple" },
    { v: "standard", label: "Standard" },
    { v: "advanced", label: "Advanced" },
  ] as const;
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-full px-3 py-1.5 transition-colors ${
            value === o.v
              ? "bg-gradient-brand text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
