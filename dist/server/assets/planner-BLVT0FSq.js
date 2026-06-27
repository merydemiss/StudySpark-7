import { n as useServerFn } from "./createSsrRpc-DfY1OTDB.js";
import { a as getStudyStats, c as logSession, i as deleteGoal, l as toggleAssignment, n as createGoal, o as listAssignments, r as deleteAssignment, s as listGoals, t as createAssignment } from "./planner.functions-CZ4TjnHc.js";
import { useEffect, useRef, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Calendar, CheckCircle2, Circle, Flame, Pause, Play, Plus, RotateCcw, Target, Timer, Trash2 } from "lucide-react";
//#region src/routes/_authenticated/planner.tsx?tsr-split=component
function PlannerPage() {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8 md:py-12",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "mb-6",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl font-bold tracking-tight md:text-4xl",
					children: "Study Planner"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-muted-foreground mt-2 text-sm",
					children: "Track assignments, set weekly goals, and run focus sessions."
				})]
			}),
			/* @__PURE__ */ jsx(StatsRow, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsx(Assignments, {}), /* @__PURE__ */ jsx(Goals, {})]
				}), /* @__PURE__ */ jsx(FocusTimer, {})]
			})
		]
	});
}
function StatsRow() {
	const fn = useServerFn(getStudyStats);
	const s = useQuery({
		queryKey: ["study-stats"],
		queryFn: () => fn()
	}).data ?? {
		todayMinutes: 0,
		weekMinutes: 0,
		totalSessions: 0,
		streak: 0
	};
	return /* @__PURE__ */ jsx("div", {
		className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
		children: [
			{
				label: "Today",
				value: `${s.todayMinutes}m`,
				icon: Timer,
				hue: "from-brand-blue to-brand-purple"
			},
			{
				label: "This week",
				value: `${s.weekMinutes}m`,
				icon: Target,
				hue: "from-brand-purple to-brand-pink"
			},
			{
				label: "Sessions",
				value: String(s.totalSessions),
				icon: CheckCircle2,
				hue: "from-emerald-400 to-teal-500"
			},
			{
				label: "Streak",
				value: `${s.streak}d`,
				icon: Flame,
				hue: "from-orange-400 to-pink-500"
			}
		].map((c) => /* @__PURE__ */ jsxs("div", {
			className: "shadow-card rounded-2xl border border-border bg-card p-5",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground text-sm font-medium",
					children: c.label
				}), /* @__PURE__ */ jsx("span", {
					className: `bg-gradient-to-br ${c.hue} grid h-9 w-9 place-items-center rounded-xl`,
					children: /* @__PURE__ */ jsx(c.icon, { className: "h-4.5 w-4.5 text-white" })
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "font-display mt-3 text-3xl font-bold",
				children: c.value
			})]
		}, c.label))
	});
}
function Assignments() {
	const qc = useQueryClient();
	const listFn = useServerFn(listAssignments);
	const createFn = useServerFn(createAssignment);
	const toggleFn = useServerFn(toggleAssignment);
	const delFn = useServerFn(deleteAssignment);
	const q = useQuery({
		queryKey: ["assignments"],
		queryFn: () => listFn()
	});
	const [title, setTitle] = useState("");
	const [subject, setSubject] = useState("");
	const [due, setDue] = useState("");
	const [priority, setPriority] = useState("medium");
	const add = useMutation({
		mutationFn: () => createFn({ data: {
			title,
			subject: subject || null,
			due_at: due ? new Date(due).toISOString() : null,
			priority
		} }),
		onSuccess: () => {
			setTitle("");
			setSubject("");
			setDue("");
			setPriority("medium");
			qc.invalidateQueries({ queryKey: ["assignments"] });
			toast.success("Assignment added");
		},
		onError: (e) => toast.error(e.message)
	});
	const toggle = useMutation({
		mutationFn: (v) => toggleFn({ data: v }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["assignments"] })
	});
	const remove = useMutation({
		mutationFn: (id) => delFn({ data: { id } }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["assignments"] })
	});
	return /* @__PURE__ */ jsxs("section", {
		className: "shadow-card rounded-2xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ jsxs("h2", {
				className: "font-display mb-3 flex items-center gap-2 text-lg font-semibold",
				children: [/* @__PURE__ */ jsx(Calendar, { className: "text-primary h-5 w-5" }), " Assignments"]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: (e) => {
					e.preventDefault();
					if (!title.trim()) return;
					add.mutate();
				},
				className: "grid gap-2 sm:grid-cols-[1fr_auto_auto_auto_auto]",
				children: [
					/* @__PURE__ */ jsx("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Essay on the French Revolution…",
						className: "rounded-xl border border-input bg-background px-3 py-2 text-sm"
					}),
					/* @__PURE__ */ jsx("input", {
						value: subject,
						onChange: (e) => setSubject(e.target.value),
						placeholder: "Subject",
						className: "rounded-xl border border-input bg-background px-3 py-2 text-sm sm:w-32"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "datetime-local",
						value: due,
						onChange: (e) => setDue(e.target.value),
						className: "rounded-xl border border-input bg-background px-3 py-2 text-sm"
					}),
					/* @__PURE__ */ jsxs("select", {
						value: priority,
						onChange: (e) => setPriority(e.target.value),
						className: "rounded-xl border border-input bg-background px-3 py-2 text-sm",
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "low",
								children: "Low"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "medium",
								children: "Med"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "high",
								children: "High"
							})
						]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "submit",
						disabled: add.isPending,
						className: "bg-gradient-brand inline-flex items-center justify-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add"]
					})
				]
			}),
			/* @__PURE__ */ jsxs("ul", {
				className: "mt-4 space-y-1.5",
				children: [q.data?.length === 0 && /* @__PURE__ */ jsx("li", {
					className: "text-muted-foreground rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center text-sm",
					children: "No assignments yet — add one above."
				}), q.data?.map((a) => {
					const overdue = a.due_at && a.status === "pending" && new Date(a.due_at) < /* @__PURE__ */ new Date();
					return /* @__PURE__ */ jsxs("li", {
						className: "hover:bg-accent/60 group flex items-center gap-3 rounded-xl border border-border px-3 py-2.5",
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: () => toggle.mutate({
									id: a.id,
									status: a.status === "done" ? "pending" : "done"
								}),
								className: "text-muted-foreground hover:text-primary",
								children: a.status === "done" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "text-primary h-5 w-5" }) : /* @__PURE__ */ jsx(Circle, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: `truncate text-sm font-medium ${a.status === "done" ? "text-muted-foreground line-through" : ""}`,
									children: a.title
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2 text-xs",
									children: [
										a.subject && /* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-accent px-2 py-0.5",
											children: a.subject
										}),
										a.due_at && /* @__PURE__ */ jsxs("span", {
											className: overdue ? "font-semibold text-destructive" : "",
											children: [new Date(a.due_at).toLocaleString(void 0, {
												month: "short",
												day: "numeric",
												hour: "numeric",
												minute: "2-digit"
											}), overdue && " · overdue"]
										}),
										/* @__PURE__ */ jsx(PriorityBadge, { p: a.priority })
									]
								})]
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: () => remove.mutate(a.id),
								className: "text-muted-foreground hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100",
								"aria-label": "Delete",
								children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
							})
						]
					}, a.id);
				})]
			})
		]
	});
}
function PriorityBadge({ p }) {
	return /* @__PURE__ */ jsx("span", {
		className: `rounded-full px-2 py-0.5 ${p === "high" ? "bg-destructive/15 text-destructive" : p === "medium" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
		children: p
	});
}
function Goals() {
	const qc = useQueryClient();
	const listFn = useServerFn(listGoals);
	const createFn = useServerFn(createGoal);
	const delFn = useServerFn(deleteGoal);
	const statsFn = useServerFn(getStudyStats);
	const q = useQuery({
		queryKey: ["goals"],
		queryFn: () => listFn()
	});
	const stats = useQuery({
		queryKey: ["study-stats"],
		queryFn: () => statsFn()
	});
	const [title, setTitle] = useState("");
	const [target, setTarget] = useState(300);
	const [period, setPeriod] = useState("weekly");
	const add = useMutation({
		mutationFn: () => createFn({ data: {
			title,
			target_minutes: target,
			period
		} }),
		onSuccess: () => {
			setTitle("");
			setTarget(300);
			qc.invalidateQueries({ queryKey: ["goals"] });
			toast.success("Goal added");
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: (id) => delFn({ data: { id } }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] })
	});
	const progressFor = (g) => {
		const m = g.period === "monthly" ? (stats.data?.weekMinutes ?? 0) * 4 : stats.data?.weekMinutes ?? 0;
		return Math.min(100, Math.round(m / g.target_minutes * 100));
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "shadow-card rounded-2xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ jsxs("h2", {
				className: "font-display mb-3 flex items-center gap-2 text-lg font-semibold",
				children: [/* @__PURE__ */ jsx(Target, { className: "text-primary h-5 w-5" }), " Goals"]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: (e) => {
					e.preventDefault();
					if (!title.trim()) return;
					add.mutate();
				},
				className: "grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]",
				children: [
					/* @__PURE__ */ jsx("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Read 5 hrs of biology",
						className: "rounded-xl border border-input bg-background px-3 py-2 text-sm"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "number",
						min: 15,
						max: 1e4,
						value: target,
						onChange: (e) => setTarget(Number(e.target.value)),
						className: "w-24 rounded-xl border border-input bg-background px-3 py-2 text-sm"
					}),
					/* @__PURE__ */ jsxs("select", {
						value: period,
						onChange: (e) => setPeriod(e.target.value),
						className: "rounded-xl border border-input bg-background px-3 py-2 text-sm",
						children: [/* @__PURE__ */ jsx("option", {
							value: "weekly",
							children: "Weekly"
						}), /* @__PURE__ */ jsx("option", {
							value: "monthly",
							children: "Monthly"
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						type: "submit",
						className: "bg-gradient-brand inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add"]
					})
				]
			}),
			/* @__PURE__ */ jsxs("ul", {
				className: "mt-4 space-y-2",
				children: [q.data?.length === 0 && /* @__PURE__ */ jsx("li", {
					className: "text-muted-foreground text-sm",
					children: "No goals yet."
				}), q.data?.map((g) => {
					const pct = progressFor(g);
					return /* @__PURE__ */ jsxs("li", {
						className: "rounded-xl border border-border p-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "mb-1 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ jsx("div", {
										className: "truncate text-sm font-medium",
										children: g.title
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-muted-foreground text-xs",
										children: [
											g.target_minutes,
											" min · ",
											g.period
										]
									})]
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => remove.mutate(g.id),
									className: "text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "h-2 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ jsx("div", {
									className: "bg-gradient-brand h-full transition-all",
									style: { width: `${pct}%` }
								})
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "text-muted-foreground mt-1 text-xs",
								children: [pct, "% complete"]
							})
						]
					}, g.id);
				})]
			})
		]
	});
}
function FocusTimer() {
	const qc = useQueryClient();
	const logFn = useServerFn(logSession);
	const [focusMin, setFocusMin] = useState(25);
	const [breakMin, setBreakMin] = useState(5);
	const [subject, setSubject] = useState("");
	const [mode, setMode] = useState("focus");
	const [remaining, setRemaining] = useState(1500);
	const [running, setRunning] = useState(false);
	const intervalRef = useRef(null);
	useEffect(() => {
		if (!running) setRemaining(mode === "focus" ? focusMin * 60 : breakMin * 60);
	}, [
		focusMin,
		breakMin,
		mode,
		running
	]);
	useEffect(() => {
		if (!running) return;
		intervalRef.current = setInterval(() => {
			setRemaining((r) => {
				if (r <= 1) {
					if (intervalRef.current) clearInterval(intervalRef.current);
					if (mode === "focus") {
						logFn({ data: {
							subject: subject || null,
							duration_seconds: focusMin * 60
						} }).then(() => {
							qc.invalidateQueries({ queryKey: ["study-stats"] });
							toast.success(`+${focusMin}m logged. Break time!`);
						}).catch(() => {});
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
		}, 1e3);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [
		running,
		mode,
		focusMin,
		breakMin,
		subject,
		logFn,
		qc
	]);
	const pct = ((mode === "focus" ? focusMin * 60 : breakMin * 60) - remaining) / (mode === "focus" ? focusMin * 60 : breakMin * 60);
	const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
	const ss = (remaining % 60).toString().padStart(2, "0");
	const reset = () => {
		setRunning(false);
		setRemaining(mode === "focus" ? focusMin * 60 : breakMin * 60);
	};
	const logManual = () => {
		const elapsed = (mode === "focus" ? focusMin * 60 : breakMin * 60) - remaining;
		if (elapsed < 60) {
			toast.error("Run at least 1 minute to log a session");
			return;
		}
		if (mode !== "focus") return;
		logFn({ data: {
			subject: subject || null,
			duration_seconds: elapsed
		} }).then(() => {
			qc.invalidateQueries({ queryKey: ["study-stats"] });
			toast.success(`+${Math.round(elapsed / 60)}m logged`);
			reset();
		}).catch((e) => toast.error(e.message));
	};
	return /* @__PURE__ */ jsxs("section", {
		className: "shadow-card sticky top-4 h-fit rounded-2xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ jsxs("h2", {
				className: "font-display mb-1 flex items-center gap-2 text-lg font-semibold",
				children: [/* @__PURE__ */ jsx(Timer, { className: "text-primary h-5 w-5" }), " Focus timer"]
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-muted-foreground mb-4 text-xs",
				children: [
					"Pomodoro style — focus for ",
					focusMin,
					", break for ",
					breakMin,
					"."
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative mx-auto grid aspect-square w-full max-w-[260px] place-items-center",
				children: [/* @__PURE__ */ jsxs("svg", {
					className: "absolute inset-0 -rotate-90",
					viewBox: "0 0 100 100",
					children: [/* @__PURE__ */ jsx("circle", {
						cx: "50",
						cy: "50",
						r: "46",
						className: "fill-none stroke-muted",
						strokeWidth: "6"
					}), /* @__PURE__ */ jsx("circle", {
						cx: "50",
						cy: "50",
						r: "46",
						className: mode === "focus" ? "fill-none stroke-primary" : "fill-none stroke-brand-pink",
						strokeWidth: "6",
						strokeLinecap: "round",
						strokeDasharray: `${2 * Math.PI * 46}`,
						strokeDashoffset: `${2 * Math.PI * 46 * (1 - pct)}`,
						style: { transition: "stroke-dashoffset 0.5s linear" }
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-center",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "font-display text-5xl font-bold tabular-nums",
						children: [
							mm,
							":",
							ss
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "text-muted-foreground mt-1 text-xs uppercase tracking-wide",
						children: mode === "focus" ? "Focus" : "Break"
					})]
				})]
			}),
			/* @__PURE__ */ jsx("input", {
				value: subject,
				onChange: (e) => setSubject(e.target.value),
				placeholder: "What are you studying?",
				className: "mt-4 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 grid grid-cols-2 gap-2 text-sm",
				children: [/* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-muted-foreground mb-1 block text-xs",
						children: "Focus min"
					}), /* @__PURE__ */ jsx("input", {
						type: "number",
						min: 5,
						max: 120,
						value: focusMin,
						onChange: (e) => setFocusMin(Number(e.target.value)),
						disabled: running,
						className: "w-full rounded-xl border border-input bg-background px-3 py-2"
					})]
				}), /* @__PURE__ */ jsxs("label", {
					className: "block",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-muted-foreground mb-1 block text-xs",
						children: "Break min"
					}), /* @__PURE__ */ jsx("input", {
						type: "number",
						min: 1,
						max: 60,
						value: breakMin,
						onChange: (e) => setBreakMin(Number(e.target.value)),
						disabled: running,
						className: "w-full rounded-xl border border-input bg-background px-3 py-2"
					})]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					!running ? /* @__PURE__ */ jsxs("button", {
						onClick: () => setRunning(true),
						className: "bg-gradient-brand inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow",
						children: [/* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }), " Start"]
					}) : /* @__PURE__ */ jsxs("button", {
						onClick: () => setRunning(false),
						className: "inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold",
						children: [/* @__PURE__ */ jsx(Pause, { className: "h-4 w-4" }), " Pause"]
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: reset,
						className: "hover:bg-accent inline-flex items-center justify-center gap-1 rounded-full border border-border px-3 py-2.5 text-sm",
						children: /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" })
					}),
					mode === "focus" && /* @__PURE__ */ jsx("button", {
						onClick: logManual,
						className: "hover:bg-accent inline-flex items-center justify-center rounded-full border border-border px-3 py-2.5 text-xs",
						children: "Log now"
					})
				]
			})
		]
	});
}
//#endregion
export { PlannerPage as component };
