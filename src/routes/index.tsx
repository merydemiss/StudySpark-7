import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  BookOpen,
  Brain,
  MessageSquare,
  Layers,
  Trophy,
  ChevronRight,
  Check,
} from "lucide-react";
import heroImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudySpark — Study Smarter, Not Harder" },
      {
        name: "description",
        content:
          "AI-powered learning platform with a personal tutor, smart notes, and instant flashcards. Built for students.",
      },
      { property: "og:title", content: "StudySpark — Study Smarter, Not Harder" },
      {
        property: "og:description",
        content:
          "AI-powered learning platform with a personal tutor, smart notes, and instant flashcards.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Demo />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-gradient-brand grid h-9 w-9 place-items-center rounded-xl shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">StudySpark</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#demo" className="hover:text-foreground">Demo</a>
          <a href="#testimonials" className="hover:text-foreground">Students</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className="bg-gradient-brand inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
          >
            Get started
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-soft" />
      <div
        aria-hidden
        className="bg-gradient-brand absolute -top-32 right-[-10%] -z-10 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="bg-gradient-brand h-1.5 w-1.5 rounded-full" />
            AI tutor · Smart notes · Flashcards
          </span>
          <h1 className="font-display mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Study smarter,
            <br />
            <span className="text-gradient-brand">not harder.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            StudySpark turns your notes into summaries, flashcards, and a 24/7 AI tutor that
            actually explains things. Built by students, for students.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Start learning free
              <ChevronRight className="h-4 w-4" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent"
            >
              See it in action
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No credit card", "All subjects", "Mobile-ready"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="bg-gradient-brand absolute -inset-2 -z-10 rounded-[2rem] opacity-30 blur-2xl" />
          <img
            src={heroImage}
            alt="Student learning with AI study assistant"
            width={1536}
            height={1024}
            className="shadow-card w-full rounded-[2rem] border border-border/60"
          />
        </div>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section id="demo" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          A tutor that gets it.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Ask anything. Choose how deep you want to go. StudySpark adapts.
        </p>
      </div>
      <div className="shadow-card mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-4/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-2/70" />
          <span className="ml-3 text-xs text-muted-foreground">StudySpark · Tutor</span>
        </div>
        <div className="space-y-4 p-6">
          <ChatBubble role="user">
            Can you explain photosynthesis like I'm 12?
          </ChatBubble>
          <ChatBubble role="assistant">
            Sure! Photosynthesis is how plants make their own food. They take sunlight ☀️,
            water 💧, and a gas called CO₂ from the air, and turn it into sugar (their
            food) and oxygen (which we breathe). Think of leaves as tiny solar-powered
            kitchens.
          </ChatBubble>
          <ChatBubble role="user">Make a flashcard for this.</ChatBubble>
          <ChatBubble role="assistant">
            <strong>Q:</strong> What three things do plants need for photosynthesis?
            <br />
            <strong>A:</strong> Sunlight, water, and carbon dioxide.
          </ChatBubble>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-gradient-brand max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 text-sm text-primary-foreground shadow-sm">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm text-foreground">
        {children}
      </div>
    </div>
  );
}

const features = [
  {
    icon: MessageSquare,
    title: "AI Study Assistant",
    body: "Ask anything across math, science, history, or languages. Choose simple, standard, or advanced explanations.",
  },
  {
    icon: BookOpen,
    title: "Smart Notes",
    body: "Paste lecture notes or a chapter. Get a summary, key points, and flashcards in seconds.",
  },
  {
    icon: Layers,
    title: "Flashcards & Quizzes",
    body: "Auto-generated study sets that adapt to what you already know.",
  },
  {
    icon: Brain,
    title: "Concept Coaching",
    body: "Stuck on a topic? StudySpark walks you through step-by-step until it clicks.",
  },
  {
    icon: Trophy,
    title: "Streaks & XP",
    body: "Build a daily study habit with streaks, levels, and tiny celebrations along the way.",
  },
  {
    icon: Sparkles,
    title: "Personal Dashboard",
    body: "Track progress, see what's next, and never lose a great study session.",
  },
];

function Features() {
  return (
    <section id="features" className="bg-gradient-soft border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need to <span className="text-gradient-brand">ace it</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Six tools, one beautifully simple workspace.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group shadow-card relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-1"
            >
              <div className="bg-gradient-brand inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-glow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Maya, 17",
    role: "High school junior",
    quote:
      "I uploaded 40 pages of bio notes before my final. StudySpark turned them into flashcards I actually wanted to study.",
  },
  {
    name: "Daniel, 20",
    role: "CS undergrad",
    quote:
      "The tutor explains discrete math in a way my textbook just… doesn't. It's like having office hours at 2am.",
  },
  {
    name: "Priya, 16",
    role: "IB student",
    quote: "Honestly the only study app I open daily. The streaks keep me going.",
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Loved by students.
        </h2>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="shadow-card rounded-2xl border border-border bg-card p-6"
          >
            <blockquote className="text-foreground">"{t.quote}"</blockquote>
            <figcaption className="mt-4 text-sm">
              <span className="font-semibold">{t.name}</span>
              <span className="text-muted-foreground"> · {t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="bg-gradient-brand shadow-glow relative overflow-hidden rounded-3xl px-8 py-14 text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl">
          Your next study session, supercharged.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
          Join thousands of students learning faster with their personal AI tutor.
        </p>
        <Link
          to="/auth"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-base font-semibold text-foreground transition-transform hover:scale-[1.03]"
        >
          Get StudySpark free
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} StudySpark. Study smarter, not harder.
    </footer>
  );
}
