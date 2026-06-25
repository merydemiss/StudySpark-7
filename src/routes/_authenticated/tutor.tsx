import { createFileRoute, Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createThread, deleteThread, listThreads } from "@/lib/threads.functions";
import { MessageSquarePlus, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/tutor")({
  head: () => ({ meta: [{ title: "AI Tutor — StudySpark" }] }),
  component: TutorLayout,
});

function TutorLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const listFn = useServerFn(listThreads);
  const createFn = useServerFn(createThread);
  const deleteFn = useServerFn(deleteThread);

  const threadsQ = useQuery({ queryKey: ["threads"], queryFn: () => listFn() });

  const create = useMutation({
    mutationFn: () => createFn({ data: { difficulty: "standard" } }),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/tutor/$threadId", params: { threadId: t.id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create chat"),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["threads"] }),
  });

  const params = useParams({ strict: false }) as { threadId?: string };
  const activeId = params.threadId;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-sidebar/40 md:flex">
        <div className="border-b border-border p-4">
          <button
            onClick={() => create.mutate()}
            disabled={create.isPending}
            className="bg-gradient-brand inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            <MessageSquarePlus className="h-4 w-4" /> New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {threadsQ.data?.length ? (
            <ul className="space-y-0.5">
              {threadsQ.data.map((t) => {
                const active = t.id === activeId;
                return (
                  <li key={t.id} className="group relative">
                    <Link
                      to="/tutor/$threadId"
                      params={{ threadId: t.id }}
                      className={`block truncate rounded-lg px-3 py-2 pr-9 text-sm font-medium transition-colors ${
                        active
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground/80 hover:bg-accent/60"
                      }`}
                    >
                      {t.title}
                    </Link>
                    <button
                      aria-label="Delete chat"
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm("Delete this chat?")) {
                          del.mutate(t.id);
                          if (active) navigate({ to: "/tutor" });
                        }
                      }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No chats yet.</p>
          )}
        </div>
      </aside>

      <section className="flex-1 overflow-hidden">
        {activeId ? (
          <Outlet />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <span className="bg-gradient-brand grid h-16 w-16 place-items-center rounded-2xl shadow-glow">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </span>
            <h1 className="font-display mt-5 text-3xl font-bold">Your AI tutor is ready.</h1>
            <p className="mt-2 max-w-md text-muted-foreground">
              Start a new chat to ask anything across math, science, history, and more.
            </p>
            <button
              onClick={() => create.mutate()}
              disabled={create.isPending}
              className="bg-gradient-brand mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              <MessageSquarePlus className="h-4 w-4" /> Start a chat
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
