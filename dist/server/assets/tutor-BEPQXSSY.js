import { n as useServerFn } from "./createSsrRpc-CFvjpL_S.js";
import { i as listThreads, n as deleteThread, t as createThread } from "./threads.functions-Ue6AVtZ3.js";
import { Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquarePlus, Sparkles, Trash2 } from "lucide-react";
//#region src/routes/_authenticated/tutor.tsx?tsr-split=component
function TutorLayout() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const listFn = useServerFn(listThreads);
	const createFn = useServerFn(createThread);
	const deleteFn = useServerFn(deleteThread);
	const threadsQ = useQuery({
		queryKey: ["threads"],
		queryFn: () => listFn()
	});
	const create = useMutation({
		mutationFn: () => createFn({ data: { difficulty: "standard" } }),
		onSuccess: (t) => {
			qc.invalidateQueries({ queryKey: ["threads"] });
			navigate({
				to: "/tutor/$threadId",
				params: { threadId: t.id }
			});
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Could not create chat")
	});
	const del = useMutation({
		mutationFn: (id) => deleteFn({ data: { id } }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["threads"] })
	});
	const activeId = useParams({ strict: false }).threadId;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-[calc(100vh-3.5rem)] md:h-screen",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "hidden w-72 shrink-0 flex-col border-r border-border bg-sidebar/40 md:flex",
			children: [/* @__PURE__ */ jsx("div", {
				className: "border-b border-border p-4",
				children: /* @__PURE__ */ jsxs("button", {
					onClick: () => create.mutate(),
					disabled: create.isPending,
					className: "bg-gradient-brand inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60",
					children: [/* @__PURE__ */ jsx(MessageSquarePlus, { className: "h-4 w-4" }), " New chat"]
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "flex-1 overflow-y-auto p-2",
				children: threadsQ.data?.length ? /* @__PURE__ */ jsx("ul", {
					className: "space-y-0.5",
					children: threadsQ.data.map((t) => {
						const active = t.id === activeId;
						return /* @__PURE__ */ jsxs("li", {
							className: "group relative",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/tutor/$threadId",
								params: { threadId: t.id },
								className: `block truncate rounded-lg px-3 py-2 pr-9 text-sm font-medium transition-colors ${active ? "bg-accent text-accent-foreground" : "text-foreground/80 hover:bg-accent/60"}`,
								children: t.title
							}), /* @__PURE__ */ jsx("button", {
								"aria-label": "Delete chat",
								onClick: (e) => {
									e.preventDefault();
									if (confirm("Delete this chat?")) {
										del.mutate(t.id);
										if (active) navigate({ to: "/tutor" });
									}
								},
								className: "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 opacity-0 transition-opacity hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100",
								children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
							})]
						}, t.id);
					})
				}) : /* @__PURE__ */ jsx("p", {
					className: "px-3 py-6 text-center text-sm text-muted-foreground",
					children: "No chats yet."
				})
			})]
		}), /* @__PURE__ */ jsx("section", {
			className: "flex-1 overflow-hidden",
			children: activeId ? /* @__PURE__ */ jsx(Outlet, {}) : /* @__PURE__ */ jsxs("div", {
				className: "flex h-full flex-col items-center justify-center p-8 text-center",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "bg-gradient-brand grid h-16 w-16 place-items-center rounded-2xl shadow-glow",
						children: /* @__PURE__ */ jsx(Sparkles, { className: "h-7 w-7 text-primary-foreground" })
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "font-display mt-5 text-3xl font-bold",
						children: "Your AI tutor is ready."
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 max-w-md text-muted-foreground",
						children: "Start a new chat to ask anything across math, science, history, and more."
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => create.mutate(),
						disabled: create.isPending,
						className: "bg-gradient-brand mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60",
						children: [/* @__PURE__ */ jsx(MessageSquarePlus, { className: "h-4 w-4" }), " Start a chat"]
					})
				]
			})
		})]
	});
}
//#endregion
export { TutorLayout as component };
