import { t as createLovableAiGatewayProvider } from "./ai-gateway.server-BVGsytFR.js";
import { t as supabase } from "./client-WeurdN5J.js";
import { t as Route$10 } from "./profile-CxMcTf8q.js";
import { t as Route$11 } from "./dashboard-CIvHnjll.js";
import { t as Route$12 } from "./tutor._threadId-CBid0vXf.js";
import { t as Route$13 } from "./notes._noteId-XzuUvYDD.js";
import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { createClient } from "@supabase/supabase-js";
import { convertToModelMessages, streamText } from "ai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
//#region src/styles.css?url
var styles_default = "/assets/styles-CWSDz2sS.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-gradient-brand text-7xl font-bold",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "bg-gradient-brand inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Try again, or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "bg-gradient-brand inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-full border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "StudySpark — Study Smarter, Not Harder" },
			{
				name: "description",
				content: "AI-powered learning platform that turns your notes into summaries, flashcards, and a personal tutor who answers any question."
			},
			{
				property: "og:title",
				content: "StudySpark — Study Smarter, Not Harder"
			},
			{
				property: "og:description",
				content: "AI tutor, smart notes, flashcards — built for students."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	const router = useRouter();
	useEffect(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster$1, {
			position: "top-right",
			richColors: true
		})]
	});
}
//#endregion
//#region src/routes/auth.tsx
var $$splitComponentImporter$6 = () => import("./auth-DXIStafM.js");
var Route$8 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign in — StudySpark" }, {
		name: "description",
		content: "Sign in or create your StudySpark account."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/_authenticated/route.tsx
var $$splitComponentImporter$5 = () => import("./route-4-UVAaL4.js");
var Route$7 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$4 = () => import("./routes-Dba70qa_.js");
var Route$6 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "StudySpark — Study Smarter, Not Harder" },
		{
			name: "description",
			content: "AI-powered learning platform with a personal tutor, smart notes, and instant flashcards. Built for students."
		},
		{
			property: "og:title",
			content: "StudySpark — Study Smarter, Not Harder"
		},
		{
			property: "og:description",
			content: "AI-powered learning platform with a personal tutor, smart notes, and instant flashcards."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/api/tts.ts
var Route$5 = createFileRoute("/api/tts")({ server: { handlers: { POST: async ({ request }) => {
	const body = await request.json();
	const text = (body.text ?? "").trim();
	if (!text) return new Response("Missing text", { status: 400 });
	if (text.length > 4e3) return new Response("Text too long (max 4000 chars per chunk)", { status: 400 });
	const key = process.env.LOVABLE_API_KEY;
	if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
	try {
		const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${key}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "openai/gpt-4o-mini-tts",
				input: text,
				voice: body.voice ?? "alloy",
				speed: body.speed ?? 1,
				instructions: body.instructions,
				stream_format: "sse",
				response_format: "pcm"
			}),
			signal: request.signal
		});
		if (!upstream.ok || !upstream.body) {
			const errText = await upstream.text().catch(() => "");
			return new Response(errText || "TTS failed", { status: upstream.status });
		}
		return new Response(upstream.body, { headers: { "Content-Type": "text/event-stream" } });
	} catch (err) {
		if (request.signal.aborted) return new Response(null, { status: 499 });
		throw err;
	}
} } } });
//#endregion
//#region src/routes/api/chat.ts
var difficultyPrompt = {
	simple: "Explain like the student is 10 years old. Use very short sentences, friendly analogies, and avoid jargon.",
	standard: "Explain clearly for a high-school or early-college student. Define key terms and give one concrete example.",
	advanced: "Explain at a university level. Be precise, use proper terminology, and include nuance and edge cases."
};
var Route$4 = createFileRoute("/api/chat")({ server: { handlers: { POST: async ({ request }) => {
	const body = await request.json();
	const messages = body.messages;
	const threadId = body.threadId;
	const difficulty = body.difficulty ?? "standard";
	if (!Array.isArray(messages) || !threadId) return new Response("Bad request", { status: 400 });
	const auth = request.headers.get("authorization");
	if (!auth?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
	const token = auth.slice(7);
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_PUBLISHABLE_KEY;
	const lovableKey = process.env.LOVABLE_API_KEY;
	if (!lovableKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
	const supabase = createClient(url, key, {
		global: { fetch: (input, init) => {
			const headers = new Headers(init?.headers);
			headers.set("apikey", key);
			headers.set("Authorization", `Bearer ${token}`);
			return fetch(input, {
				...init,
				headers
			});
		} },
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			storage: void 0
		}
	});
	const { data: userData, error: userErr } = await supabase.auth.getUser(token);
	if (userErr || !userData.user) return new Response("Unauthorized", { status: 401 });
	const userId = userData.user.id;
	const { data: thread } = await supabase.from("chat_threads").select("id, title").eq("id", threadId).eq("user_id", userId).maybeSingle();
	if (!thread) return new Response("Thread not found", { status: 404 });
	const lastUser = [...messages].reverse().find((m) => m.role === "user");
	if (lastUser) {
		await supabase.from("chat_messages").insert({
			thread_id: threadId,
			user_id: userId,
			role: "user",
			parts: lastUser.parts
		});
		if (thread.title === "New chat") {
			const text = lastUser.parts.map((p) => p.type === "text" ? p.text : "").join(" ").slice(0, 60);
			if (text) await supabase.from("chat_threads").update({ title: text }).eq("id", threadId);
		}
	}
	const gateway = createLovableAiGatewayProvider(lovableKey);
	const modelMessages = await convertToModelMessages(messages);
	return streamText({
		model: gateway("google/gemini-3-flash-preview"),
		system: "You are StudySpark, a friendly AI study tutor for students. You explain math, science, history, languages, and general subjects. Use markdown: short headings, bullet points, bold key terms, and KaTeX-style math when relevant. Stay encouraging and clear. " + difficultyPrompt[difficulty],
		messages: modelMessages,
		onFinish: async ({ text }) => {
			await supabase.from("chat_messages").insert({
				thread_id: threadId,
				user_id: userId,
				role: "assistant",
				parts: [{
					type: "text",
					text
				}]
			});
			await supabase.from("chat_threads").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", threadId);
		}
	}).toUIMessageStreamResponse({ originalMessages: messages });
} } } });
//#endregion
//#region src/routes/_authenticated/voice.tsx
var $$splitComponentImporter$3 = () => import("./voice-CKQ1BnPK.js");
var Route$3 = createFileRoute("/_authenticated/voice")({
	head: () => ({ meta: [{ title: "Voice Broadcast — StudySpark" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/_authenticated/tutor.tsx
var $$splitComponentImporter$2 = () => import("./tutor-BEPQXSSY.js");
var Route$2 = createFileRoute("/_authenticated/tutor")({
	head: () => ({ meta: [{ title: "AI Tutor — StudySpark" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/_authenticated/planner.tsx
var $$splitComponentImporter$1 = () => import("./planner-BG2Zo2xa.js");
var Route$1 = createFileRoute("/_authenticated/planner")({
	head: () => ({ meta: [{ title: "Study Planner — StudySpark" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/_authenticated/notes.tsx
var $$splitComponentImporter = () => import("./notes-DNjJwYEn.js");
var Route = createFileRoute("/_authenticated/notes")({
	head: () => ({ meta: [{ title: "Smart Notes — StudySpark" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var AuthRoute = Route$8.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$9
});
var AuthenticatedRouteRoute = Route$7.update({
	id: "/_authenticated",
	getParentRoute: () => Route$9
});
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var ApiTtsRoute = Route$5.update({
	id: "/api/tts",
	path: "/api/tts",
	getParentRoute: () => Route$9
});
var ApiChatRoute = Route$4.update({
	id: "/api/chat",
	path: "/api/chat",
	getParentRoute: () => Route$9
});
var AuthenticatedVoiceRoute = Route$3.update({
	id: "/voice",
	path: "/voice",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedTutorRoute = Route$2.update({
	id: "/tutor",
	path: "/tutor",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProfileRoute = Route$10.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPlannerRoute = Route$1.update({
	id: "/planner",
	path: "/planner",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNotesRoute = Route.update({
	id: "/notes",
	path: "/notes",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$11.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedTutorThreadIdRoute = Route$12.update({
	id: "/$threadId",
	path: "/$threadId",
	getParentRoute: () => AuthenticatedTutorRoute
});
var AuthenticatedNotesRouteChildren = { AuthenticatedNotesNoteIdRoute: Route$13.update({
	id: "/$noteId",
	path: "/$noteId",
	getParentRoute: () => AuthenticatedNotesRoute
}) };
var AuthenticatedNotesRouteWithChildren = AuthenticatedNotesRoute._addFileChildren(AuthenticatedNotesRouteChildren);
var AuthenticatedTutorRouteChildren = { AuthenticatedTutorThreadIdRoute };
var AuthenticatedRouteRouteChildren = {
	AuthenticatedDashboardRoute,
	AuthenticatedNotesRoute: AuthenticatedNotesRouteWithChildren,
	AuthenticatedPlannerRoute,
	AuthenticatedProfileRoute,
	AuthenticatedTutorRoute: AuthenticatedTutorRoute._addFileChildren(AuthenticatedTutorRouteChildren),
	AuthenticatedVoiceRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ApiChatRoute,
	ApiTtsRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
