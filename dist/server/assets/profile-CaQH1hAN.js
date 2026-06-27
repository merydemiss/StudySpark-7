import { n as useServerFn } from "./createSsrRpc-CFvjpL_S.js";
import { t as supabase } from "./client-WeurdN5J.js";
import { t as Route } from "./profile-CxMcTf8q.js";
import { i as listThreads } from "./threads.functions-Ue6AVtZ3.js";
import { i as listNotes } from "./notes.functions-DXYutRUf.js";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookOpen, Flame, LogOut, Mail, MessageSquare, Trophy } from "lucide-react";
//#region src/routes/_authenticated/profile.tsx?tsr-split=component
function ProfilePage() {
	const { user } = Route.useRouteContext();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const threadsFn = useServerFn(listThreads);
	const notesFn = useServerFn(listNotes);
	const threadsQ = useQuery({
		queryKey: ["threads"],
		queryFn: () => threadsFn()
	});
	const notesQ = useQuery({
		queryKey: ["notes"],
		queryFn: () => notesFn()
	});
	const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Student";
	const initials = name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
	const totalXp = ((threadsQ.data?.length ?? 0) + (notesQ.data?.length ?? 0)) * 25;
	const level = Math.max(1, Math.floor(totalXp / 100) + 1);
	const signOut = async () => {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		toast.success("Signed out");
		navigate({
			to: "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8 md:py-12",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "bg-gradient-brand shadow-glow relative overflow-hidden rounded-3xl p-6 text-primary-foreground md:p-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4",
					children: [/* @__PURE__ */ jsx("div", {
						className: "font-display grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur",
						children: initials
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("h1", {
							className: "font-display truncate text-2xl font-bold md:text-3xl",
							children: name
						}), /* @__PURE__ */ jsxs("p", {
							className: "mt-1 flex min-w-0 items-center gap-1.5 text-sm opacity-90",
							children: [/* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ jsx("span", {
								className: "truncate",
								children: user.email
							})]
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-6 grid grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ jsx(Pill, {
							icon: Trophy,
							label: "Level",
							value: String(level)
						}),
						/* @__PURE__ */ jsx(Pill, {
							icon: Flame,
							label: "Streak",
							value: "1 day"
						}),
						/* @__PURE__ */ jsx(Pill, {
							icon: Trophy,
							label: "XP",
							value: String(totalXp)
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsx(Stat, {
					icon: MessageSquare,
					label: "Tutor chats",
					value: threadsQ.data?.length ?? 0
				}), /* @__PURE__ */ jsx(Stat, {
					icon: BookOpen,
					label: "Note sets",
					value: notesQ.data?.length ?? 0
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mt-8 rounded-2xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "font-display text-lg font-semibold",
						children: "Account"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: ["Signed in as ", /* @__PURE__ */ jsx("span", {
							className: "font-medium text-foreground",
							children: user.email
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: signOut,
						className: "mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-destructive hover:text-destructive-foreground",
						children: [/* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), " Sign out"]
					})
				]
			})
		]
	});
}
function Pill({ icon: Icon, label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl bg-white/15 px-3 py-3 text-center backdrop-blur",
		children: [
			/* @__PURE__ */ jsx(Icon, { className: "mx-auto h-4 w-4 opacity-90" }),
			/* @__PURE__ */ jsx("div", {
				className: "font-display mt-1 text-lg font-bold",
				children: value
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-[11px] uppercase tracking-wider opacity-80",
				children: label
			})
		]
	});
}
function Stat({ icon: Icon, label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "shadow-card flex items-center justify-between rounded-2xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
			className: "text-sm text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("p", {
			className: "font-display mt-1 text-3xl font-bold",
			children: value
		})] }), /* @__PURE__ */ jsx("span", {
			className: "bg-gradient-brand grid h-11 w-11 place-items-center rounded-xl shadow-glow",
			children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-primary-foreground" })
		})]
	});
}
//#endregion
export { ProfilePage as component };
