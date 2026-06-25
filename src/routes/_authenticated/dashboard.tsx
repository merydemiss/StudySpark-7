import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listThreads } from "@/lib/threads.functions";
import { listNotes } from "@/lib/notes.functions";
import { listAssignments, getStudyStats } from "@/lib/planner.functions";

import {
  MessageSquare,
  BookOpen,
  Flame,
  Trophy,
  ArrowRight,
  Plus,
  Sparkles,
  Calendar,
  Timer,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — StudySpark" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const threadsFn = useServerFn(listThreads);
  const notesFn = useServerFn(listNotes);
  const assignFn = useServerFn(listAssignments);
  const statsFn = useServerFn(getStudyStats);
  const threadsQ = useQuery({ queryKey: ["threads"], queryFn: () => threadsFn() });
  const notesQ = useQuery({ queryKey: ["notes"], queryFn: () => notesFn() });
  const assignQ = useQuery({ queryKey: ["assignments"], queryFn: () => assignFn() });
  const statsQ = useQuery({ queryKey: ["study-stats"], queryFn: () => statsFn() });

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "there";

  const xp =
    ((threadsQ.data?.length ?? 0) + (notesQ.data?.length ?? 0)) * 25 +
    (statsQ.data?.totalSessions ?? 0) * 15 +
    (assignQ.data?.filter((a) => a.status === "done").length ?? 0) * 20;

  const stats = [
    { label: "Day streak", value: `${statsQ.data?.streak ?? 0}`, icon: Flame, hue: "from-orange-400 to-pink-500" },
    { label: "Today focus", value: `${statsQ.data?.todayMinutes ?? 0}m`, icon: Timer, hue: "from-brand-blue to-brand-purple" },
    { label: "Note sets", value: String(notesQ.data?.length ?? 0), icon: BookOpen, hue: "from-brand-purple to-brand-pink" },
    { label: "XP", value: String(xp), icon: Trophy, hue: "from-yellow-400 to-orange-500" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="font-display mt-1 truncate text-3xl font-bold tracking-tight md:text-4xl">
            Hi {name} 👋
          </h1>
        </div>
        <Link
          to="/tutor"
          className="bg-gradient-brand inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
        >
          <Sparkles className="h-4 w-4" /> Ask tutor
        </Link>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="shadow-card relative overflow-hidden rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              <span className={`bg-gradient-to-br ${s.hue} grid h-9 w-9 place-items-center rounded-xl`}>
                <s.icon className="h-4.5 w-4.5 text-white" />
              </span>
            </div>
            <div className="font-display mt-3 text-3xl font-bold">{s.value}</div>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card title="Continue with AI Tutor" cta={{ to: "/tutor", label: "New chat", icon: Plus }}>
          {threadsQ.data && threadsQ.data.length > 0 ? (
            <ul className="space-y-1">
              {threadsQ.data.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <Link
                    to="/tutor/$threadId"
                    params={{ threadId: t.id }}
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                  >
                    <span className="truncate font-medium">{t.title}</span>
                    <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="No chats yet"
              body="Ask your first question to get started."
              to="/tutor"
              cta="Open tutor"
            />
          )}
        </Card>

        <Card title="Recent notes" cta={{ to: "/notes", label: "New notes", icon: Plus }}>
          {notesQ.data && notesQ.data.length > 0 ? (
            <ul className="space-y-1">
              {notesQ.data.slice(0, 5).map((n) => (
                <li key={n.id}>
                  <Link
                    to="/notes/$noteId"
                    params={{ noteId: n.id }}
                    className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-accent"
                  >
                    <div className="truncate text-sm font-medium">{n.title}</div>
                    {n.summary && (
                      <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{n.summary}</div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No notes yet"
              body="Paste your study material to get a summary and flashcards."
              to="/notes"
              cta="Add notes"
            />
          )}
        </Card>

        <Card title="Upcoming assignments" cta={{ to: "/planner", label: "Plan", icon: Plus }}>
          {assignQ.data && assignQ.data.filter((a) => a.status === "pending").length > 0 ? (
            <ul className="space-y-1">
              {assignQ.data
                .filter((a) => a.status === "pending")
                .slice(0, 5)
                .map((a) => {
                  const overdue = a.due_at && new Date(a.due_at) < new Date();
                  return (
                    <li key={a.id}>
                      <Link
                        to="/planner"
                        className="hover:bg-accent flex items-center justify-between rounded-xl px-3 py-2.5 text-sm"
                      >
                        <span className="truncate font-medium">{a.title}</span>
                        <span
                          className={`ml-2 shrink-0 text-xs ${overdue ? "font-semibold text-destructive" : "text-muted-foreground"}`}
                        >
                          {a.due_at
                            ? new Date(a.due_at).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No assignments"
              body="Add tasks and deadlines to stay on track."
              to="/planner"
              cta="Open planner"
            />
          )}
        </Card>
      </section>
    </div>
  );
}

function Card({
  title,
  cta,
  children,
}: {
  title: string;
  cta: { to: string; label: string; icon: typeof Plus };
  children: React.ReactNode;
}) {
  return (
    <div className="shadow-card rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <Link
          to={cta.to}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <cta.icon className="h-3.5 w-3.5" /> {cta.label}
        </Link>
      </div>
      {children}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  to,
  cta,
}: {
  icon: typeof MessageSquare;
  title: string;
  body: string;
  to: string;
  cta: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center">
      <div className="bg-gradient-brand mx-auto grid h-10 w-10 place-items-center rounded-xl shadow-glow">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <h3 className="font-display mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <Link
        to={to}
        className="bg-gradient-brand mt-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
      >
        {cta}
      </Link>
    </div>
  );
}
