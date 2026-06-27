import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BookOpen, Brain, Check, ChevronRight, Layers, MessageSquare, Sparkles, Trophy } from "lucide-react";
//#region src/assets/hero.jpg
var hero_default = "/assets/hero-BCWHIX-1.jpg";
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Landing() {
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsx(Nav, {}),
			/* @__PURE__ */ jsx(Hero, {}),
			/* @__PURE__ */ jsx(Demo, {}),
			/* @__PURE__ */ jsx(Features, {}),
			/* @__PURE__ */ jsx(Testimonials, {}),
			/* @__PURE__ */ jsx(CTA, {}),
			/* @__PURE__ */ jsx(Footer, {})
		]
	});
}
function Nav() {
	return /* @__PURE__ */ jsx("header", {
		className: "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "bg-gradient-brand grid h-9 w-9 place-items-center rounded-xl shadow-glow",
						children: /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-primary-foreground" })
					}), /* @__PURE__ */ jsx("span", {
						className: "font-display text-lg font-bold tracking-tight",
						children: "StudySpark"
					})]
				}),
				/* @__PURE__ */ jsxs("nav", {
					className: "hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: "#features",
							className: "hover:text-foreground",
							children: "Features"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#demo",
							className: "hover:text-foreground",
							children: "Demo"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#testimonials",
							className: "hover:text-foreground",
							children: "Students"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/auth",
						className: "hidden rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:inline-flex",
						children: "Sign in"
					}), /* @__PURE__ */ jsxs(Link, {
						to: "/auth",
						className: "bg-gradient-brand inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]",
						children: ["Get started", /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })]
					})]
				})
			]
		})
	});
}
function Hero() {
	return /* @__PURE__ */ jsxs("section", {
		className: "relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", { className: "absolute inset-0 -z-10 bg-gradient-soft" }),
			/* @__PURE__ */ jsx("div", {
				"aria-hidden": true,
				className: "bg-gradient-brand absolute -top-32 right-[-10%] -z-10 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "animate-fade-in",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm",
							children: [/* @__PURE__ */ jsx("span", { className: "bg-gradient-brand h-1.5 w-1.5 rounded-full" }), "AI tutor · Smart notes · Flashcards"]
						}),
						/* @__PURE__ */ jsxs("h1", {
							className: "font-display mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl",
							children: [
								"Study smarter,",
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx("span", {
									className: "text-gradient-brand",
									children: "not harder."
								})
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-6 max-w-xl text-lg text-muted-foreground",
							children: "StudySpark turns your notes into summaries, flashcards, and a 24/7 AI tutor that actually explains things. Built by students, for students."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ jsxs(Link, {
								to: "/auth",
								className: "bg-gradient-brand inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]",
								children: ["Start learning free", /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ jsx("a", {
								href: "#demo",
								className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent",
								children: "See it in action"
							})]
						}),
						/* @__PURE__ */ jsx("ul", {
							className: "mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground",
							children: [
								"No credit card",
								"All subjects",
								"Mobile-ready"
							].map((f) => /* @__PURE__ */ jsxs("li", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-primary" }),
									" ",
									f
								]
							}, f))
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx("div", { className: "bg-gradient-brand absolute -inset-2 -z-10 rounded-[2rem] opacity-30 blur-2xl" }), /* @__PURE__ */ jsx("img", {
						src: hero_default,
						alt: "Student learning with AI study assistant",
						width: 1536,
						height: 1024,
						className: "shadow-card w-full rounded-[2rem] border border-border/60"
					})]
				})]
			})
		]
	});
}
function Demo() {
	return /* @__PURE__ */ jsxs("section", {
		id: "demo",
		className: "mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-2xl text-center",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "font-display text-4xl font-bold tracking-tight md:text-5xl",
				children: "A tutor that gets it."
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-4 text-muted-foreground",
				children: "Ask anything. Choose how deep you want to go. StudySpark adapts."
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "shadow-card mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-border bg-card",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3",
				children: [
					/* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-destructive/70" }),
					/* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-chart-4/70" }),
					/* @__PURE__ */ jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-chart-2/70" }),
					/* @__PURE__ */ jsx("span", {
						className: "ml-3 text-xs text-muted-foreground",
						children: "StudySpark · Tutor"
					})
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-4 p-6",
				children: [
					/* @__PURE__ */ jsx(ChatBubble, {
						role: "user",
						children: "Can you explain photosynthesis like I'm 12?"
					}),
					/* @__PURE__ */ jsx(ChatBubble, {
						role: "assistant",
						children: "Sure! Photosynthesis is how plants make their own food. They take sunlight ☀️, water 💧, and a gas called CO₂ from the air, and turn it into sugar (their food) and oxygen (which we breathe). Think of leaves as tiny solar-powered kitchens."
					}),
					/* @__PURE__ */ jsx(ChatBubble, {
						role: "user",
						children: "Make a flashcard for this."
					}),
					/* @__PURE__ */ jsxs(ChatBubble, {
						role: "assistant",
						children: [
							/* @__PURE__ */ jsx("strong", { children: "Q:" }),
							" What three things do plants need for photosynthesis?",
							/* @__PURE__ */ jsx("br", {}),
							/* @__PURE__ */ jsx("strong", { children: "A:" }),
							" Sunlight, water, and carbon dioxide."
						]
					})
				]
			})]
		})]
	});
}
function ChatBubble({ role, children }) {
	if (role === "user") return /* @__PURE__ */ jsx("div", {
		className: "flex justify-end",
		children: /* @__PURE__ */ jsx("div", {
			className: "bg-gradient-brand max-w-[80%] rounded-2xl rounded-br-md px-4 py-3 text-sm text-primary-foreground shadow-sm",
			children
		})
	});
	return /* @__PURE__ */ jsx("div", {
		className: "flex justify-start",
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-[80%] rounded-2xl rounded-bl-md bg-muted px-4 py-3 text-sm text-foreground",
			children
		})
	});
}
var features = [
	{
		icon: MessageSquare,
		title: "AI Study Assistant",
		body: "Ask anything across math, science, history, or languages. Choose simple, standard, or advanced explanations."
	},
	{
		icon: BookOpen,
		title: "Smart Notes",
		body: "Paste lecture notes or a chapter. Get a summary, key points, and flashcards in seconds."
	},
	{
		icon: Layers,
		title: "Flashcards & Quizzes",
		body: "Auto-generated study sets that adapt to what you already know."
	},
	{
		icon: Brain,
		title: "Concept Coaching",
		body: "Stuck on a topic? StudySpark walks you through step-by-step until it clicks."
	},
	{
		icon: Trophy,
		title: "Streaks & XP",
		body: "Build a daily study habit with streaks, levels, and tiny celebrations along the way."
	},
	{
		icon: Sparkles,
		title: "Personal Dashboard",
		body: "Track progress, see what's next, and never lose a great study session."
	}
];
function Features() {
	return /* @__PURE__ */ jsx("section", {
		id: "features",
		className: "bg-gradient-soft border-y border-border/60",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [/* @__PURE__ */ jsxs("h2", {
					className: "font-display text-4xl font-bold tracking-tight md:text-5xl",
					children: [
						"Everything you need to ",
						/* @__PURE__ */ jsx("span", {
							className: "text-gradient-brand",
							children: "ace it"
						}),
						"."
					]
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-4 text-muted-foreground",
					children: "Six tools, one beautifully simple workspace."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: features.map((f) => /* @__PURE__ */ jsxs("div", {
					className: "group shadow-card relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-1",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "bg-gradient-brand inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-glow",
							children: /* @__PURE__ */ jsx(f.icon, { className: "h-5 w-5 text-primary-foreground" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "mt-4 text-lg font-semibold",
							children: f.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: f.body
						})
					]
				}, f.title))
			})]
		})
	});
}
var testimonials = [
	{
		name: "Maya, 17",
		role: "High school junior",
		quote: "I uploaded 40 pages of bio notes before my final. StudySpark turned them into flashcards I actually wanted to study."
	},
	{
		name: "Daniel, 20",
		role: "CS undergrad",
		quote: "The tutor explains discrete math in a way my textbook just… doesn't. It's like having office hours at 2am."
	},
	{
		name: "Priya, 16",
		role: "IB student",
		quote: "Honestly the only study app I open daily. The streaks keep me going."
	}
];
function Testimonials() {
	return /* @__PURE__ */ jsxs("section", {
		id: "testimonials",
		className: "mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24",
		children: [/* @__PURE__ */ jsx("div", {
			className: "mx-auto max-w-2xl text-center",
			children: /* @__PURE__ */ jsx("h2", {
				className: "font-display text-4xl font-bold tracking-tight md:text-5xl",
				children: "Loved by students."
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-12 grid gap-4 md:grid-cols-3",
			children: testimonials.map((t) => /* @__PURE__ */ jsxs("figure", {
				className: "shadow-card rounded-2xl border border-border bg-card p-6",
				children: [/* @__PURE__ */ jsxs("blockquote", {
					className: "text-foreground",
					children: [
						"\"",
						t.quote,
						"\""
					]
				}), /* @__PURE__ */ jsxs("figcaption", {
					className: "mt-4 text-sm",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-semibold",
						children: t.name
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground",
						children: [" · ", t.role]
					})]
				})]
			}, t.name))
		})]
	});
}
function CTA() {
	return /* @__PURE__ */ jsx("section", {
		className: "mx-auto max-w-7xl px-4 pb-20 sm:px-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-gradient-brand shadow-glow relative overflow-hidden rounded-3xl px-8 py-14 text-center",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl",
					children: "Your next study session, supercharged."
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mx-auto mt-4 max-w-xl text-primary-foreground/85",
					children: "Join thousands of students learning faster with their personal AI tutor."
				}),
				/* @__PURE__ */ jsxs(Link, {
					to: "/auth",
					className: "mt-8 inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 text-base font-semibold text-foreground transition-transform hover:scale-[1.03]",
					children: ["Get StudySpark free", /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })]
				})
			]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ jsxs("footer", {
		className: "border-t border-border/60 py-8 text-center text-sm text-muted-foreground",
		children: [
			"© ",
			(/* @__PURE__ */ new Date()).getFullYear(),
			" StudySpark. Study smarter, not harder."
		]
	});
}
//#endregion
export { Landing as component };
