import { r as createServerFn } from "./esm-B5zcwdrx.js";
import { t as createServerRpc } from "./createServerRpc-COXvQ23j.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CQsR9LLs.js";
import { t as createLovableAiGatewayProvider } from "./ai-gateway.server-BVGsytFR.js";
import { Output, generateText } from "ai";
import { z } from "zod";
//#region src/lib/notes.functions.ts?tss-serverfn-split
var FlashcardSchema = z.object({
	front: z.string(),
	back: z.string()
});
var NoteAnalysisSchema = z.object({
	title: z.string().describe("A short 3-6 word title for these notes"),
	summary: z.string().describe("A clear 2-4 sentence summary"),
	keyPoints: z.array(z.string()).min(3).max(10).describe("The most important takeaways as bullets"),
	flashcards: z.array(FlashcardSchema).min(4).max(12).describe("Question/answer pairs for spaced repetition")
});
var listNotes_createServerFn_handler = createServerRpc({
	id: "8c6016df94df755859f504c92677f7275e4d40af73762d0905338113191d1474",
	name: "listNotes",
	filename: "src/lib/notes.functions.ts"
}, (opts) => listNotes.__executeServer(opts));
var listNotes = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listNotes_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("notes").select("id, title, summary, updated_at").eq("user_id", context.userId).order("updated_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var getNote_createServerFn_handler = createServerRpc({
	id: "97031b97c3b00aa95e7c2afc09de32de3e01610b2da73c3f7036f9e8c1dd8c6f",
	name: "getNote",
	filename: "src/lib/notes.functions.ts"
}, (opts) => getNote.__executeServer(opts));
var getNote = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(getNote_createServerFn_handler, async ({ context, data }) => {
	const { data: row, error } = await context.supabase.from("notes").select("*").eq("id", data.id).eq("user_id", context.userId).maybeSingle();
	if (error) throw new Error(error.message);
	return row;
});
var deleteNote_createServerFn_handler = createServerRpc({
	id: "a5208b3e264091f6aa64b115bd63613e1b53f409fd60c01f55e8eb3a55fd9577",
	name: "deleteNote",
	filename: "src/lib/notes.functions.ts"
}, (opts) => deleteNote.__executeServer(opts));
var deleteNote = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(deleteNote_createServerFn_handler, async ({ context, data }) => {
	const { error } = await context.supabase.from("notes").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var createAndAnalyzeNote_createServerFn_handler = createServerRpc({
	id: "3cba125e8193fc87f26b66d1cf56990a4671b43f0f4d8524501934d97b7dd750",
	name: "createAndAnalyzeNote",
	filename: "src/lib/notes.functions.ts"
}, (opts) => createAndAnalyzeNote.__executeServer(opts));
var createAndAnalyzeNote = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	sourceText: z.string().min(20, "Please paste at least a few sentences").max(4e4),
	title: z.string().optional()
}).parse(d)).handler(createAndAnalyzeNote_createServerFn_handler, async ({ context, data }) => {
	const lovableKey = process.env.LOVABLE_API_KEY;
	if (!lovableKey) throw new Error("AI is not configured");
	const { experimental_output } = await generateText({
		model: createLovableAiGatewayProvider(lovableKey)("google/gemini-3-flash-preview"),
		experimental_output: Output.object({ schema: NoteAnalysisSchema }),
		system: "You are StudySpark's note-processing tutor. Analyze the student's notes and produce a clear summary, key points, and flashcards that help them remember the material.",
		prompt: `Process these notes:\n\n${data.sourceText}`
	});
	const analysis = experimental_output;
	const { data: row, error } = await context.supabase.from("notes").insert({
		user_id: context.userId,
		title: data.title || analysis.title,
		source_text: data.sourceText,
		summary: analysis.summary,
		key_points: analysis.keyPoints,
		flashcards: analysis.flashcards
	}).select("id").single();
	if (error) throw new Error(error.message);
	return row;
});
//#endregion
export { createAndAnalyzeNote_createServerFn_handler, deleteNote_createServerFn_handler, getNote_createServerFn_handler, listNotes_createServerFn_handler };
