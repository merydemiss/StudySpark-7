import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listThreads } from "@/lib/threads.functions";
import { listNotes } from "@/lib/notes.functions";
import { supabase } from "@/integrations/supabase/client";
import { Mail, LogOut, Trophy, MessageSquare, BookOpen, Flame } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — StudySpark" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const threadsFn = useServerFn(listThreads);
  const notesFn = useServerFn(listNotes);
  const threadsQ = useQuery({ queryKey: ["threads"], queryFn: () => threadsFn() });
  const notesQ = useQuery({ queryKey: ["notes"], queryFn: () => notesFn() });

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Student";
  const initials = name
    .split(" ")
    .map((p: string) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const totalXp = ((threadsQ.data?.length ?? 0) + (notesQ.data?.length ?? 0)) * 25;
  const level = Math.max(1, Math.floor(totalXp / 100) + 1);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
      <header className="bg-gradient-brand shadow-glow relative overflow-hidden rounded-3xl p-6 text-primary-foreground md:p-8">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <div className="font-display grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur">
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className="font-display truncate text-2xl font-bold md:text-3xl">{name}</h1>
            <p className="mt-1 flex min-w-0 items-center gap-1.5 text-sm opacity-90">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.email}</span>
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Pill icon={Trophy} label="Level" value={String(level)} />
          <Pill icon={Flame} label="Streak" value="1 day" />
          <Pill icon={Trophy} label="XP" value={String(totalXp)} />
        </div>
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Stat icon={MessageSquare} label="Tutor chats" value={threadsQ.data?.length ?? 0} />
        <Stat icon={BookOpen} label="Note sets" value={notesQ.data?.length ?? 0} />
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user.email}</span>
        </p>
        <button
          onClick={signOut}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    </div>
  );
}

function Pill({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/15 px-3 py-3 text-center backdrop-blur">
      <Icon className="mx-auto h-4 w-4 opacity-90" />
      <div className="font-display mt-1 text-lg font-bold">{value}</div>
      <div className="text-[11px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: number }) {
  return (
    <div className="shadow-card flex items-center justify-between rounded-2xl border border-border bg-card p-5">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-display mt-1 text-3xl font-bold">{value}</p>
      </div>
      <span className="bg-gradient-brand grid h-11 w-11 place-items-center rounded-xl shadow-glow">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </span>
    </div>
  );
}
