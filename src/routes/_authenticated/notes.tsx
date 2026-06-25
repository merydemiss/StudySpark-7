import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { BookOpen, Sparkles, Plus, Trash2, FileText } from "lucide-react";
import { createAndAnalyzeNote, deleteNote, listNotes } from "@/lib/notes.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notes")({
  head: () => ({ meta: [{ title: "Smart Notes — StudySpark" }] }),
  component: NotesLayout,
});

function NotesLayout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const listFn = useServerFn(listNotes);
  const createFn = useServerFn(createAndAnalyzeNote);
  const deleteFn = useServerFn(deleteNote);

  const notesQ = useQuery({ queryKey: ["notes"], queryFn: () => listFn() });
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const create = useMutation({
    mutationFn: () => createFn({ data: { title: title || undefined, sourceText: text } }),
    onSuccess: (n) => {
      toast.success("Notes processed!");
      setTitle("");
      setText("");
      setComposerOpen(false);
      qc.invalidateQueries({ queryKey: ["notes"] });
      navigate({ to: "/notes/$noteId", params: { noteId: n.id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not analyze notes"),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  const onFile = async (file: File) => {
    if (!file.type.startsWith("text/") && !file.name.endsWith(".md") && !file.name.endsWith(".txt")) {
      toast.error("Please upload a plain text or markdown file (or paste your notes).");
      return;
    }
    const t = await file.text();
    setText(t.slice(0, 40000));
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
    setComposerOpen(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display truncate text-3xl font-bold tracking-tight md:text-4xl">
            Smart Notes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste notes or upload a file — get a summary, key points, and flashcards.
          </p>
        </div>
        <button
          onClick={() => setComposerOpen((s) => !s)}
          className="bg-gradient-brand inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> New notes
        </button>
      </header>

      {composerOpen && (
        <div className="shadow-card mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-muted/30 p-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional) — e.g. Bio Ch.4 Photosynthesis"
              className="w-full bg-transparent text-lg font-semibold outline-none placeholder:text-muted-foreground"
            />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your notes, lecture transcript, or chapter here…"
            className="h-56 w-full resize-y bg-card p-4 text-sm outline-none"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold hover:bg-accent">
              <FileText className="h-3.5 w-3.5" /> Upload .txt / .md
              <input
                type="file"
                accept=".txt,.md,text/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onFile(f);
                }}
              />
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{text.length.toLocaleString()} chars</span>
              <button
                onClick={() => create.mutate()}
                disabled={create.isPending || text.length < 20}
                className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                {create.isPending ? "Analyzing…" : "Analyze with AI"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="mt-8">
        {notesQ.isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : notesQ.data && notesQ.data.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {notesQ.data.map((n) => (
              <li key={n.id} className="group relative">
                <Link
                  to="/notes/$noteId"
                  params={{ noteId: n.id }}
                  className="shadow-card block h-full rounded-2xl border border-border bg-card p-5 transition-transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-brand inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-glow">
                    <BookOpen className="h-4.5 w-4.5 text-primary-foreground" />
                  </div>
                  <h3 className="mt-3 line-clamp-2 font-semibold">{n.title}</h3>
                  {n.summary && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{n.summary}</p>
                  )}
                </Link>
                <button
                  onClick={() => {
                    if (confirm("Delete these notes?")) del.mutate(n.id);
                  }}
                  className="absolute right-3 top-3 rounded-md bg-background/80 p-1.5 opacity-0 backdrop-blur transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <div className="bg-gradient-brand mx-auto grid h-12 w-12 place-items-center rounded-2xl shadow-glow">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="font-display mt-4 text-xl font-bold">No notes yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste your first batch of notes and let AI do the heavy lifting.
            </p>
            <button
              onClick={() => setComposerOpen(true)}
              className="bg-gradient-brand mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              <Plus className="h-4 w-4" /> Add notes
            </button>
          </div>
        )}
      </section>

      <Outlet />
    </div>
  );
}
