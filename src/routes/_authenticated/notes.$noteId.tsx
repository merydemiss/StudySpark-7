import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, RotateCw, X } from "lucide-react";
import { getNote } from "@/lib/notes.functions";

export const Route = createFileRoute("/_authenticated/notes/$noteId")({
  component: NoteDetailModal,
});

type Flashcard = { front: string; back: string };

function NoteDetailModal() {
  const { noteId } = Route.useParams();
  const getNoteFn = useServerFn(getNote);
  const noteQ = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteFn({ data: { id: noteId } }),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-0 backdrop-blur-sm md:items-center md:p-6">
      <div className="shadow-card animate-fade-in relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-t-3xl border border-border bg-card md:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-3 backdrop-blur">
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <Link
            to="/notes"
            aria-label="Close"
            className="rounded-full p-1.5 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        <div className="max-h-[calc(92vh-3.5rem)] overflow-y-auto p-6 md:p-8">
          {noteQ.isLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : !noteQ.data ? (
            <p>Note not found.</p>
          ) : (
            <article className="space-y-8">
              <header>
                <h1 className="font-display text-3xl font-bold tracking-tight">{noteQ.data.title}</h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(noteQ.data.updated_at).toLocaleString()}
                </p>
              </header>

              {noteQ.data.summary && (
                <section>
                  <h2 className="font-display mb-2 text-lg font-semibold">Summary</h2>
                  <p className="rounded-2xl bg-muted/50 p-4 text-sm leading-relaxed">
                    {noteQ.data.summary}
                  </p>
                </section>
              )}

              {Array.isArray(noteQ.data.key_points) && (
                <section>
                  <h2 className="font-display mb-2 text-lg font-semibold">Key points</h2>
                  <ul className="space-y-2">
                    {(noteQ.data.key_points as string[]).map((p, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="bg-gradient-brand mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground">
                          {i + 1}
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {Array.isArray(noteQ.data.flashcards) && (
                <section>
                  <h2 className="font-display mb-3 text-lg font-semibold">Flashcards</h2>
                  <FlashcardDeck cards={noteQ.data.flashcards as Flashcard[]} />
                </section>
              )}
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!cards.length) return null;
  const card = cards[i];
  const next = () => {
    setFlipped(false);
    setI((p) => (p + 1) % cards.length);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setFlipped((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            setFlipped((s) => !s);
          }
        }}
        className="bg-gradient-brand shadow-glow grid min-h-48 cursor-pointer place-items-center rounded-3xl p-8 text-center text-primary-foreground transition-all hover:scale-[1.01]"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
            {flipped ? "Answer" : "Question"}
          </p>
          <p className="font-display mt-2 text-xl font-bold">{flipped ? card.back : card.front}</p>
          <p className="mt-3 text-xs opacity-70">Tap to flip</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Card {i + 1} of {cards.length}
        </span>
        <button
          onClick={next}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-primary hover:text-primary-foreground"
        >
          <RotateCw className="h-3 w-3" /> Next card
        </button>
      </div>
    </div>
  );
}
