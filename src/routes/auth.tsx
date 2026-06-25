import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — StudySpark" },
      { name: "description", content: "Sign in or create your StudySpark account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Welcome! Check your inbox to confirm your email.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message || "Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="bg-gradient-soft relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="bg-gradient-brand absolute -top-40 left-1/2 -z-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="shadow-card w-full max-w-md rounded-3xl border border-border bg-card p-8">
          <Link to="/" className="flex items-center justify-center gap-2">
            <span className="bg-gradient-brand grid h-10 w-10 place-items-center rounded-xl shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="font-display text-xl font-bold">StudySpark</span>
          </Link>
          <h1 className="font-display mt-6 text-center text-2xl font-bold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to keep learning." : "Free forever. No credit card."}
          </p>

          <button
            type="button"
            onClick={google}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent disabled:opacity-60"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or with email
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring transition-all focus:ring-2"
                required
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring transition-all focus:ring-2"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              minLength={6}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring transition-all focus:ring-2"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-brand mt-2 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to StudySpark?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.5 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.09-1.92 3.22-4.76 3.22-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.05-3.71 1.05-2.86 0-5.28-1.93-6.15-4.52H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.46.35-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.96l3.67-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.67 2.84C6.72 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
