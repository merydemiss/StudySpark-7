import { r as createServerFn } from "./esm-B5zcwdrx.js";
import { t as createSsrRpc } from "./createSsrRpc-DfY1OTDB.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CQsR9LLs.js";
import { z } from "zod";
//#region src/lib/notes.functions.ts
var listNotes = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("8c6016df94df755859f504c92677f7275e4d40af73762d0905338113191d1474"));
var getNote = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(createSsrRpc("97031b97c3b00aa95e7c2afc09de32de3e01610b2da73c3f7036f9e8c1dd8c6f"));
var deleteNote = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(createSsrRpc("a5208b3e264091f6aa64b115bd63613e1b53f409fd60c01f55e8eb3a55fd9577"));
var createAndAnalyzeNote = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	sourceText: z.string().min(20, "Please paste at least a few sentences").max(4e4),
	title: z.string().optional()
}).parse(d)).handler(createSsrRpc("3cba125e8193fc87f26b66d1cf56990a4671b43f0f4d8524501934d97b7dd750"));
//#endregion
export { listNotes as i, deleteNote as n, getNote as r, createAndAnalyzeNote as t };
