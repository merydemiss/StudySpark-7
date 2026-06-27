import { t as supabase } from "./client-WeurdN5J.js";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookOpen, CalendarCheck, LayoutDashboard, LogOut, Menu, MessageSquare, Mic, Sparkles, User, X } from "lucide-react";
//#region src/components/app-shell.tsx
var links = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/tutor",
		label: "AI Tutor",
		icon: MessageSquare
	},
	{
		to: "/notes",
		label: "Smart Notes",
		icon: BookOpen
	},
	{
		to: "/voice",
		label: "Voice Broadcast",
		icon: Mic
	},
	{
		to: "/planner",
		label: "Planner",
		icon: CalendarCheck
	},
	{
		to: "/profile",
		label: "Profile",
		icon: User
	}
];
function AppShell({ children }) {
	const [open, setOpen] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex min-h-screen bg-background",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/dashboard",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "bg-gradient-brand grid h-8 w-8 place-items-center rounded-lg",
						children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary-foreground" })
					}), /* @__PURE__ */ jsx("span", {
						className: "font-display font-bold",
						children: "StudySpark"
					})]
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => setOpen((s) => !s),
					className: "rounded-lg p-2 hover:bg-accent",
					"aria-label": "Toggle navigation",
					children: open ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
				})]
			}),
			/* @__PURE__ */ jsx(Sidebar, {
				mobileOpen: open,
				onClose: () => setOpen(false)
			}),
			/* @__PURE__ */ jsx("main", {
				className: "flex-1 pt-14 md:ml-64 md:pt-0",
				children
			})
		]
	});
}
function Sidebar({ mobileOpen, onClose }) {
	const location = useLocation();
	const navigate = useNavigate();
	const qc = useQueryClient();
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
	return /* @__PURE__ */ jsx("aside", {
		className: `fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex h-full flex-col p-4",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/dashboard",
					onClick: onClose,
					className: "mb-6 flex items-center gap-2 px-2 pt-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "bg-gradient-brand grid h-9 w-9 place-items-center rounded-xl shadow-glow",
						children: /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5 text-primary-foreground" })
					}), /* @__PURE__ */ jsx("span", {
						className: "font-display text-lg font-bold tracking-tight",
						children: "StudySpark"
					})]
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "flex flex-1 flex-col gap-1",
					children: links.map((l) => {
						const active = location.pathname.startsWith(l.to);
						return /* @__PURE__ */ jsxs(Link, {
							to: l.to,
							onClick: onClose,
							className: `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`,
							children: [/* @__PURE__ */ jsx(l.icon, { className: `h-4.5 w-4.5 ${active ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-primary"}` }), l.label]
						}, l.to);
					})
				}),
				/* @__PURE__ */ jsxs("button", {
					onClick: signOut,
					className: "mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-destructive",
					children: [/* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), " Sign out"]
				})
			]
		})
	});
}
//#endregion
//#region src/routes/_authenticated/route.tsx?tsr-split=component
var SplitComponent = () => /* @__PURE__ */ jsx(AppShell, { children: /* @__PURE__ */ jsx(Outlet, {}) });
//#endregion
export { SplitComponent as component };
