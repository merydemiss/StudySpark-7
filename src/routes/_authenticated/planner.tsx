import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  listAssignments,
  createAssignment,
  toggleAssignment,
  deleteAssignment,
  listGoals,
  createGoal,
  deleteGoal,
  logSession,
  getStudyStats,
} from "@/lib/planner.functions";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Target,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Flame,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/planner")({
  head: () => ({ meta: [{ title: "Study Planner — StudySpark" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <header className="mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Study Planner
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Track assignments, set weekly goals, and run focus sessions.
          </p>
        </header>

        <StatsRow />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <Assignments />
            <Goals />
          </div>
          <FocusTimer />
        </div>
      </div>
    </AppShell>
  );
}

function StatsRow() {
  const fn = useServerFn(getStudyStats);
  const q = useQuery({ queryKey: ["study-stats"], queryFn: () => fn() });
  const s = q.data ?? { todayMinutes: 0, weekMinutes: 0, totalSessions: 0, streak: 0 };
  const cards = [
    { label: "Today", value: `${s.todayMinutes}m`, icon: Timer, hue: "from-brand-blue to-brand-purple" },
    { label: "This week", value: `${s.weekMinutes}m`, icon: Target, hue: "from-brand-purple to-brand-pink" },
    { label: "Sessions", value: String(s.totalSessions), icon: CheckCircle2, hue: "from-emerald-400 to-teal-500" },
    { label: "Streak", value: `${s.streak}d`, icon: Flame, hue: "from-orange-400 to-pink-500" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="shadow-card rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm font-medium">{c.label}</span>
            <span className={`bg-gradient-to-br ${c.hue} grid h-9 w-9 place-items-center rounded-xl`}>
              <c.icon className="h-4.5 w-4.5 text-white" />
            </span>
          </div>
          <div className="font-display mt-3 text-3xl font-bold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

function Assignments() {
  const qc = useQueryClient();
  const listFn = useServerFn(listAssignments);
  const createFn = useServerFn(createAssignment);
  const toggleFn = useServerFn(toggleAssignment);
  const delFn = useServerFn(deleteAssignment);

  const q = useQuery({ queryKey: ["assignments"], queryFn: () => listFn() });
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const add = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          title,
          subject: subject || null,
          due_at: due ? new Date(due).toISOString() : null,
          priority,
        },
      }),
    onSuccess: () => {
      setTitle("");
      setSubject("");
      setDue("");
      setPriority("medium");
      qc.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment added");
    },
    onError: (e) => toast.error((e as Error).message),
  });

  const toggle = useMutation({
    mutationFn: (v: { id: string; status: "pending" | "done" }) => toggleFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assignments"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assignments"] }),
  });

  return (
    <section className="shadow-card rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display mb-3 flex items-center gap-2 text-lg font-semibold">
        <Calendar className="text-primary h-5 w-5" /> Assignments
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          add.mutate();
        }}
        className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto_auto]"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Essay on the French Revolution…"
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm sm:w-32"
        />
        <input
          type="datetime-local"
          value={due}
          onChange={(e) => setDue(e.target.value)}
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Med</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          disabled={add.isPending}
          className="bg-gradient-brand inline-flex items-center justify-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <ul className="mt-4 space-y-1.5">
        {q.data?.length === 0 && (
          <li className="text-muted-foreground rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm">
            No assignments yet — add one above.
          </li>
        )}
        {q.data?.map((a) => {
          const overdue =
            a.due_at && a.status === "pending" && new Date(a.due_at) < new Date();
          return (
            <li
              key={a.id}
              className="hover:bg-accent/60 group flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
            >
              <button
                onClick={() =>
                  toggle.mutate({ id: a.id, status: a.status === "done" ? "pending" : "done" })
                }
                className="text-muted-foreground hover:text-primary"
              >
                {a.status === "done" ? (
                  <CheckCircle2 className="text-primary h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <div
                  className={`truncate text-sm font-medium ${a.status === "done" ? "text-muted-foreground line-through" : ""}`}
                >
                  {a.title}
                </div>
                <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                  {a.subject && (
                    <span className="rounded-full bg-accent px-2 py-0.5">{a.subject}</span>
                  )}
                  {a.due_at && (
                    <span className={overdue ? "font-semibold text-destructive" : ""}>
                      {new Date(a.due_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {overdue && " · overdue"}
                    </span>
                  )}
                  <PriorityBadge p={a.priority} />
                </div>
              </div>
              <button
                onClick={() => remove.mutate(a.id)}
                className="text-muted-foreground hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PriorityBadge({ p }: { p: string }) {
  const color =
    p === "high"
      ? "bg-destructive/15 text-destructive"
      : p === "medium"
        ? "bg-primary/15 text-primary"
        : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2 py-0.5 ${color}`}>{p}</span>;
}

function Goals() {
  const qc = useQueryClient();
  const listFn = useServerFn(listGoals);
  const createFn = useServerFn(createGoal);
  const delFn = useServerFn(deleteGoal);
  const statsFn = useServerFn(getStudyStats);

  const q = useQuery({ queryKey: ["goals"], queryFn: () => listFn() });
  const stats = useQuery({ queryKey: ["study-stats"], queryFn: () => statsFn() });

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState(300);
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  const add = useMutation({
    mutationFn: () => createFn({ data: { title, target_minutes: target, period } }),
    onSuccess: () => {
      setTitle("");
      setTarget(300);
      qc.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal added");
    },
    onError: (e) => toast.error((e as Error).message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });

  const progressFor = (g: { target_minutes: number; period: string }) => {
    const m = g.period === "monthly" ? (stats.data?.weekMinutes ?? 0) * 4 : stats.data?.weekMinutes ?? 0;
    return Math.min(100, Math.round((m / g.target_minutes) * 100));
  };

  return (
    <section className="shadow-card rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display mb-3 flex items-center gap-2 text-lg font-semibold">
        <Target className="text-primary h-5 w-5" /> Goals
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          add.mutate();
        }}
        className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Read 5 hrs of biology"
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
        <input
          type="number"
          min={15}
          max={10000}
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          className="w-24 rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as "weekly" | "monthly")}
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button
          type="submit"
          className="bg-gradient-brand inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>
      <ul className="mt-4 space-y-2">
        {q.data?.length === 0 && (
          <li className="text-muted-foreground text-sm">No goals yet.</li>
        )}
        {q.data?.map((g) => {
          const pct = progressFor(g);
          return (
            <li key={g.id} className="rounded-xl border border-border p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{g.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {g.target_minutes} min · {g.period}
                  </div>
                </div>
                <button
                  onClick={() => remove.mutate(g.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-gradient-brand h-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="text-muted-foreground mt-1 text-xs">{pct}% complete</div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FocusTimer() {
  const qc = useQueryClient();
  const logFn = useServerFn(logSession);
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [subject, setSubject] = useState("");
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) {
      setRemaining(mode === "focus" ? focusMin * 60 : breakMin * 60);
    }
  }, [focusMin, breakMin, mode, running]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (mode === "focus") {
            logFn({ data: { subject: subject || null, duration_seconds: focusMin * 60 } })
              .then(() => {
                qc.invalidateQueries({ queryKey: ["study-stats"] });
                toast.success(`+${focusMin}m logged. Break time!`);
              })
              .catch(() => {});
            setMode("break");
            setRunning(false);
            return breakMin * 60;
          } else {
            toast("Break over — back to focus!");
            setMode("focus");
            setRunning(false);
            return focusMin * 60;
          }
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, focusMin, breakMin, subject, logFn, qc]);

  const pct =
    ((mode === "focus" ? focusMin * 60 : breakMin * 60) - remaining) /
    (mode === "focus" ? focusMin * 60 : breakMin * 60);
  const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");

  const reset = () => {
    setRunning(false);
    setRemaining(mode === "focus" ? focusMin * 60 : breakMin * 60);
  };

  const logManual = () => {
    const elapsed =
      (mode === "focus" ? focusMin * 60 : breakMin * 60) - remaining;
    if (elapsed < 60) {
      toast.error("Run at least 1 minute to log a session");
      return;
    }
    if (mode !== "focus") return;
    logFn({ data: { subject: subject || null, duration_seconds: elapsed } })
      .then(() => {
        qc.invalidateQueries({ queryKey: ["study-stats"] });
        toast.success(`+${Math.round(elapsed / 60)}m logged`);
        reset();
      })
      .catch((e: Error) => toast.error(e.message));
  };

  return (
    <section className="shadow-card sticky top-4 h-fit rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display mb-1 flex items-center gap-2 text-lg font-semibold">
        <Timer className="text-primary h-5 w-5" /> Focus timer
      </h2>
      <p className="text-muted-foreground mb-4 text-xs">
        Pomodoro style — focus for {focusMin}, break for {breakMin}.
      </p>

      <div className="relative mx-auto grid aspect-square w-full max-w-[260px] place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" className="fill-none stroke-muted" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="46"
            className={mode === "focus" ? "fill-none stroke-primary" : "fill-none stroke-brand-pink"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 46}`}
            strokeDashoffset={`${2 * Math.PI * 46 * (1 - pct)}`}
            style={{ transition: "stroke-dashoffset 0.5s linear" }}
          />
        </svg>
        <div className="text-center">
          <div className="font-display text-5xl font-bold tabular-nums">
            {mm}:{ss}
          </div>
          <div className="text-muted-foreground mt-1 text-xs uppercase tracking-wide">
            {mode === "focus" ? "Focus" : "Break"}
          </div>
        </div>
      </div>

      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="What are you studying?"
        className="mt-4 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
      />

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <label className="block">
          <span className="text-muted-foreground mb-1 block text-xs">Focus min</span>
          <input
            type="number"
            min={5}
            max={120}
            value={focusMin}
            onChange={(e) => setFocusMin(Number(e.target.value))}
            disabled={running}
            className="w-full rounded-xl border border-input bg-background px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="text-muted-foreground mb-1 block text-xs">Break min</span>
          <input
            type="number"
            min={1}
            max={60}
            value={breakMin}
            onChange={(e) => setBreakMin(Number(e.target.value))}
            disabled={running}
            className="w-full rounded-xl border border-input bg-background px-3 py-2"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!running ? (
          <button
            onClick={() => setRunning(true)}
            className="bg-gradient-brand inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Play className="h-4 w-4" /> Start
          </button>
        ) : (
          <button
            onClick={() => setRunning(false)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold"
          >
            <Pause className="h-4 w-4" /> Pause
          </button>
        )}
        <button
          onClick={reset}
          className="hover:bg-accent inline-flex items-center justify-center gap-1 rounded-full border border-border px-3 py-2.5 text-sm"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        {mode === "focus" && (
          <button
            onClick={logManual}
            className="hover:bg-accent inline-flex items-center justify-center rounded-full border border-border px-3 py-2.5 text-xs"
          >
            Log now
          </button>
        )}
      </div>
    </section>
  );
}
