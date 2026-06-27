import { n as useServerFn } from "./createSsrRpc-CFvjpL_S.js";
import { t as Route } from "./dashboard-CIvHnjll.js";
import { i as listThreads } from "./threads.functions-Ue6AVtZ3.js";
import { i as listNotes } from "./notes.functions-DXYutRUf.js";
import { a as getStudyStats, o as listAssignments } from "./planner.functions-DJE-8sIu.js";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Calendar, Flame, MessageSquare, Plus, Sparkles, Timer, Trophy } from "lucide-react";
//#region src/routes/_authenticated/dashboard.tsx?tsr-split=component
function Dashboard() {
	const { user } = Route.useRouteContext();
	const threadsFn = useServerFn(listThreads);
	const notesFn = useServerFn(listNotes);
	const assignFn = useServerFn(listAssignments);
	const statsFn = useServerFn(getStudyStats);
	const threadsQ = useQuery({
		queryKey: ["threads"],
		queryFn: () => threadsFn()
	});
	const notesQ = useQuery({
		queryKey: ["notes"],
		queryFn: () => notesFn()
	});
	const assignQ = useQuery({
		queryKey: ["assignments"],
		queryFn: () => assignFn()
	});
	const statsQ = useQuery({
		queryKey: ["study-stats"],
		queryFn: () => statsFn()
	});
	const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "there";
	const xp = ((threadsQ.data?.length ?? 0) + (notesQ.data?.length ?? 0)) * 25 + (statsQ.data?.totalSessions ?? 0) * 15 + (assignQ.data?.filter((a) => a.status === "done").length ?? 0) * 20;
	const stats = [
		{
			label: "Day streak",
			value: `${statsQ.data?.streak ?? 0}`,
			icon: Flame,
			hue: "from-orange-400 to-pink-500"
		},
		{
			label: "Today focus",
			value: `${statsQ.data?.todayMinutes ?? 0}m`,
			icon: Timer,
			hue: "from-brand-blue to-brand-purple"
		},
		{
			label: "Note sets",
			value: String(notesQ.data?.length ?? 0),
			icon: BookOpen,
			hue: "from-brand-purple to-brand-pink"
		},
		{
			label: "XP",
			value: String(xp),
			icon: Trophy,
			hue: "from-yellow-400 to-orange-500"
		}
	];
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium text-muted-foreground",
						children: (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
							weekday: "long",
							month: "long",
							day: "numeric"
						})
					}), /* @__PURE__ */ jsxs("h1", {
						className: "font-display mt-1 truncate text-3xl font-bold tracking-tight md:text-4xl",
						children: [
							"Hi ",
							name,
							" 👋"
						]
					})]
				}), /* @__PURE__ */ jsxs(Link, {
					to: "/tutor",
					className: "bg-gradient-brand inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]",
					children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }), " Ask tutor"]
				})]
			}),
			/* @__PURE__ */ jsx("section", {
				className: "mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: stats.map((s) => /* @__PURE__ */ jsxs("div", {
					className: "shadow-card relative overflow-hidden rounded-2xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-sm font-medium text-muted-foreground",
							children: s.label
						}), /* @__PURE__ */ jsx("span", {
							className: `bg-gradient-to-br ${s.hue} grid h-9 w-9 place-items-center rounded-xl`,
							children: /* @__PURE__ */ jsx(s.icon, { className: "h-4.5 w-4.5 text-white" })
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "font-display mt-3 text-3xl font-bold",
						children: s.value
					})]
				}, s.label))
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-10 grid gap-6 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ jsx(Card, {
						title: "Continue with AI Tutor",
						cta: {
							to: "/tutor",
							label: "New chat",
							icon: Plus
						},
						children: threadsQ.data && threadsQ.data.length > 0 ? /* @__PURE__ */ jsx("ul", {
							className: "space-y-1",
							children: threadsQ.data.slice(0, 5).map((t) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
								to: "/tutor/$threadId",
								params: { threadId: t.id },
								className: "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-accent",
								children: [/* @__PURE__ */ jsx("span", {
									className: "truncate font-medium",
									children: t.title
								}), /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" })]
							}) }, t.id))
						}) : /* @__PURE__ */ jsx(EmptyState, {
							icon: MessageSquare,
							title: "No chats yet",
							body: "Ask your first question to get started.",
							to: "/tutor",
							cta: "Open tutor"
						})
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Recent notes",
						cta: {
							to: "/notes",
							label: "New notes",
							icon: Plus
						},
						children: notesQ.data && notesQ.data.length > 0 ? /* @__PURE__ */ jsx("ul", {
							className: "space-y-1",
							children: notesQ.data.slice(0, 5).map((n) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
								to: "/notes/$noteId",
								params: { noteId: n.id },
								className: "group block rounded-xl px-3 py-2.5 transition-colors hover:bg-accent",
								children: [/* @__PURE__ */ jsx("div", {
									className: "truncate text-sm font-medium",
									children: n.title
								}), n.summary && /* @__PURE__ */ jsx("div", {
									className: "mt-0.5 line-clamp-1 text-xs text-muted-foreground",
									children: n.summary
								})]
							}) }, n.id))
						}) : /* @__PURE__ */ jsx(EmptyState, {
							icon: BookOpen,
							title: "No notes yet",
							body: "Paste your study material to get a summary and flashcards.",
							to: "/notes",
							cta: "Add notes"
						})
					}),
					/* @__PURE__ */ jsx(Card, {
						title: "Upcoming assignments",
						cta: {
							to: "/planner",
							label: "Plan",
							icon: Plus
						},
						children: assignQ.data && assignQ.data.filter((a) => a.status === "pending").length > 0 ? /* @__PURE__ */ jsx("ul", {
							className: "space-y-1",
							children: assignQ.data.filter((a) => a.status === "pending").slice(0, 5).map((a) => {
								const overdue = a.due_at && new Date(a.due_at) < /* @__PURE__ */ new Date();
								return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
									to: "/planner",
									className: "hover:bg-accent flex items-center justify-between rounded-xl px-3 py-2.5 text-sm",
									children: [/* @__PURE__ */ jsx("span", {
										className: "truncate font-medium",
										children: a.title
									}), /* @__PURE__ */ jsx("span", {
										className: `ml-2 shrink-0 text-xs ${overdue ? "font-semibold text-destructive" : "text-muted-foreground"}`,
										children: a.due_at ? new Date(a.due_at).toLocaleDateString(void 0, {
											month: "short",
											day: "numeric"
										}) : "—"
									})]
								}) }, a.id);
							})
						}) : /* @__PURE__ */ jsx(EmptyState, {
							icon: Calendar,
							title: "No assignments",
							body: "Add tasks and deadlines to stay on track.",
							to: "/planner",
							cta: "Open planner"
						})
					})
				]
			})
		]
	});
}
function Card({ title, cta, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "shadow-card rounded-2xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-3 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "font-display text-lg font-semibold",
				children: title
			}), /* @__PURE__ */ jsxs(Link, {
				to: cta.to,
				className: "inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground",
				children: [
					/* @__PURE__ */ jsx(cta.icon, { className: "h-3.5 w-3.5" }),
					" ",
					cta.label
				]
			})]
		}), children]
	});
}
function EmptyState({ icon: Icon, title, body, to, cta }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "bg-gradient-brand mx-auto grid h-10 w-10 place-items-center rounded-xl shadow-glow",
				children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-primary-foreground" })
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "font-display mt-3 font-semibold",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: body
			}),
			/* @__PURE__ */ jsx(Link, {
				to,
				className: "bg-gradient-brand mt-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground",
				children: cta
			})
		]
	});
}
//#endregion
export { Dashboard as component };
