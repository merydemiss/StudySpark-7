import { r as createServerFn } from "./esm-B5zcwdrx.js";
import { t as createServerRpc } from "./createServerRpc-COXvQ23j.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CQsR9LLs.js";
import { z } from "zod";
//#region src/lib/threads.functions.ts?tss-serverfn-split
var listThreads_createServerFn_handler = createServerRpc({
	id: "ebbbc99857ac917fa22c2b1d438323ae8fd03205b61e4f2e84e349f57ca98c3c",
	name: "listThreads",
	filename: "src/lib/threads.functions.ts"
}, (opts) => listThreads.__executeServer(opts));
var listThreads = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listThreads_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("chat_threads").select("id, title, difficulty, updated_at").eq("user_id", context.userId).order("updated_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var createThread_createServerFn_handler = createServerRpc({
	id: "67dca520864171111cdf48efef1043d4a0da2d685a1c0b4280bd5013be4b79c9",
	name: "createThread",
	filename: "src/lib/threads.functions.ts"
}, (opts) => createThread.__executeServer(opts));
var createThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ difficulty: z.enum([
	"simple",
	"standard",
	"advanced"
]).default("standard") }).parse(d)).handler(createThread_createServerFn_handler, async ({ context, data }) => {
	const { data: row, error } = await context.supabase.from("chat_threads").insert({
		user_id: context.userId,
		difficulty: data.difficulty
	}).select("id").single();
	if (error) throw new Error(error.message);
	return row;
});
var deleteThread_createServerFn_handler = createServerRpc({
	id: "568557aff3b98c509b2e18e3b33bc94e0f42eaf3bf5efa80b0f9c8e64ed87602",
	name: "deleteThread",
	filename: "src/lib/threads.functions.ts"
}, (opts) => deleteThread.__executeServer(opts));
var deleteThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(deleteThread_createServerFn_handler, async ({ context, data }) => {
	const { error } = await context.supabase.from("chat_threads").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getThreadMessages_createServerFn_handler = createServerRpc({
	id: "4de48302a58b8017a3864af8f5d4bfff1891bb7bbd691f1f10fb1c616272eab8",
	name: "getThreadMessages",
	filename: "src/lib/threads.functions.ts"
}, (opts) => getThreadMessages.__executeServer(opts));
var getThreadMessages = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ threadId: z.string().uuid() }).parse(d)).handler(getThreadMessages_createServerFn_handler, async ({ context, data }) => {
	const { data: thread, error: tErr } = await context.supabase.from("chat_threads").select("id, title, difficulty").eq("id", data.threadId).eq("user_id", context.userId).maybeSingle();
	if (tErr) throw new Error(tErr.message);
	if (!thread) return null;
	const { data: rows, error } = await context.supabase.from("chat_messages").select("id, role, parts, created_at").eq("thread_id", data.threadId).order("created_at", { ascending: true });
	if (error) throw new Error(error.message);
	return {
		thread,
		rows: rows ?? []
	};
});
var updateThreadDifficulty_createServerFn_handler = createServerRpc({
	id: "ca5f3f8cf8ec7e39c84e6e9d37bd9b91462cf84a252eb8704a4aa6fddabdaab9",
	name: "updateThreadDifficulty",
	filename: "src/lib/threads.functions.ts"
}, (opts) => updateThreadDifficulty.__executeServer(opts));
var updateThreadDifficulty = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	id: z.string().uuid(),
	difficulty: z.enum([
		"simple",
		"standard",
		"advanced"
	])
}).parse(d)).handler(updateThreadDifficulty_createServerFn_handler, async ({ context, data }) => {
	const { error } = await context.supabase.from("chat_threads").update({ difficulty: data.difficulty }).eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { createThread_createServerFn_handler, deleteThread_createServerFn_handler, getThreadMessages_createServerFn_handler, listThreads_createServerFn_handler, updateThreadDifficulty_createServerFn_handler };
