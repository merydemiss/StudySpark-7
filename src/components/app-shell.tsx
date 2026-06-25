import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  Mic,
  CalendarCheck,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tutor", label: "AI Tutor", icon: MessageSquare },
  { to: "/notes", label: "Smart Notes", icon: BookOpen },
  { to: "/voice", label: "Voice Broadcast", icon: Mic },
  { to: "/planner", label: "Planner", icon: CalendarCheck },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background">
      {/* mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="bg-gradient-brand grid h-8 w-8 place-items-center rounded-lg">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display font-bold">StudySpark</span>
        </Link>
        <button
          onClick={() => setOpen((s) => !s)}
          className="rounded-lg p-2 hover:bg-accent"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <Sidebar mobileOpen={open} onClose={() => setOpen(false)} />

      <main className="flex-1 pt-14 md:ml-64 md:pt-0">{children}</main>
    </div>
  );
}

function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex h-full flex-col p-4">
        <Link
          to="/dashboard"
          onClick={onClose}
          className="mb-6 flex items-center gap-2 px-2 pt-2"
        >
          <span className="bg-gradient-brand grid h-9 w-9 place-items-center rounded-xl shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">StudySpark</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {links.map((l) => {
            const active = location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <l.icon
                  className={`h-4.5 w-4.5 ${active ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-primary"}`}
                />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={signOut}
          className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
