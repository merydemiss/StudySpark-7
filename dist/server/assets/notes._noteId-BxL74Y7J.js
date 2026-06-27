import { n as useServerFn } from "./createSsrRpc-DfY1OTDB.js";
import { t as Route } from "./notes._noteId-B15jQdDF.js";
import { r as getNote } from "./notes.functions-Dh-vkZkJ.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RotateCw, X } from "lucide-react";
//#region src/routes/_authenticated/notes.$noteId.tsx?tsr-split=component
function NoteDetailModal() {
	const { noteId } = Route.useParams();
	const getNoteFn = useServerFn(getNote);
	const noteQ = useQuery({
		queryKey: ["note", noteId],
		queryFn: () => getNoteFn({ data: { id: noteId } })
	});
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-0 backdrop-blur-sm md:items-center md:p-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "shadow-card animate-fade-in relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-t-3xl border border-border bg-card md:rounded-3xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-3 backdrop-blur",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/notes",
					className: "inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }), " Back"]
				}), /* @__PURE__ */ jsx(Link, {
					to: "/notes",
					"aria-label": "Close",
					className: "rounded-full p-1.5 hover:bg-accent",
					children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "max-h-[calc(92vh-3.5rem)] overflow-y-auto p-6 md:p-8",
				children: noteQ.isLoading ? /* @__PURE__ */ jsx("p", {
					className: "text-muted-foreground",
					children: "Loading…"
				}) : !noteQ.data ? /* @__PURE__ */ jsx("p", { children: "Note not found." }) : /* @__PURE__ */ jsxs("article", {
					className: "space-y-8",
					children: [
						/* @__PURE__ */ jsxs("header", { children: [/* @__PURE__ */ jsx("h1", {
							className: "font-display text-3xl font-bold tracking-tight",
							children: noteQ.data.title
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: new Date(noteQ.data.updated_at).toLocaleString()
						})] }),
						noteQ.data.summary && /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display mb-2 text-lg font-semibold",
							children: "Summary"
						}), /* @__PURE__ */ jsx("p", {
							className: "rounded-2xl bg-muted/50 p-4 text-sm leading-relaxed",
							children: noteQ.data.summary
						})] }),
						Array.isArray(noteQ.data.key_points) && /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display mb-2 text-lg font-semibold",
							children: "Key points"
						}), /* @__PURE__ */ jsx("ul", {
							className: "space-y-2",
							children: noteQ.data.key_points.map((p, i) => /* @__PURE__ */ jsxs("li", {
								className: "flex gap-3 text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "bg-gradient-brand mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground",
									children: i + 1
								}), /* @__PURE__ */ jsx("span", { children: p })]
							}, i))
						})] }),
						Array.isArray(noteQ.data.flashcards) && /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
							className: "font-display mb-3 text-lg font-semibold",
							children: "Flashcards"
						}), /* @__PURE__ */ jsx(FlashcardDeck, { cards: noteQ.data.flashcards })] })
					]
				})
			})]
		})
	});
}
function FlashcardDeck({ cards }) {
	const [i, setI] = useState(0);
	const [flipped, setFlipped] = useState(false);
	if (!cards.length) return null;
	const card = cards[i];
	const next = () => {
		setFlipped(false);
		setI((p) => (p + 1) % cards.length);
	};
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		role: "button",
		tabIndex: 0,
		onClick: () => setFlipped((s) => !s),
		onKeyDown: (e) => {
			if (e.key === " " || e.key === "Enter") {
				e.preventDefault();
				setFlipped((s) => !s);
			}
		},
		className: "bg-gradient-brand shadow-glow grid min-h-48 cursor-pointer place-items-center rounded-3xl p-8 text-center text-primary-foreground transition-all hover:scale-[1.01]",
		children: /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-xs font-semibold uppercase tracking-wider opacity-80",
				children: flipped ? "Answer" : "Question"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "font-display mt-2 text-xl font-bold",
				children: flipped ? card.back : card.front
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-3 text-xs opacity-70",
				children: "Tap to flip"
			})
		] })
	}), /* @__PURE__ */ jsxs("div", {
		className: "mt-3 flex items-center justify-between",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "text-xs text-muted-foreground",
			children: [
				"Card ",
				i + 1,
				" of ",
				cards.length
			]
		}), /* @__PURE__ */ jsxs("button", {
			onClick: next,
			className: "inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-primary hover:text-primary-foreground",
			children: [/* @__PURE__ */ jsx(RotateCw, { className: "h-3 w-3" }), " Next card"]
		})]
	})] });
}
//#endregion
export { NoteDetailModal as component };
