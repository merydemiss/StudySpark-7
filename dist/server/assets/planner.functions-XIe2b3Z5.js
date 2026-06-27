import { r as createServerFn } from "./esm-B5zcwdrx.js";
import { t as createServerRpc } from "./createServerRpc-COXvQ23j.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CQsR9LLs.js";
import { z } from "zod";
//#region src/lib/planner.functions.ts?tss-serverfn-split
var listAssignments_createServerFn_handler = createServerRpc({
	id: "83db0b33fc64765da944179583f0109a14af13ddbaa7b20f60032e563a0c6bb7",
	name: "listAssignments",
	filename: "src/lib/planner.functions.ts"
}, (opts) => listAssignments.__executeServer(opts));
var listAssignments = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listAssignments_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("assignments").select("*").eq("user_id", context.userId).order("due_at", {
		ascending: true,
		nullsFirst: false
	});
	if (error) throw new Error(error.message);
	return data ?? [];
});
var assignmentInput = z.object({
	title: z.string().min(1).max(200),
	subject: z.string().max(80).optional().nullable(),
	notes: z.string().max(2e3).optional().nullable(),
	due_at: z.string().datetime().optional().nullable(),
	priority: z.enum([
		"low",
		"medium",
		"high"
	]).default("medium")
});
var createAssignment_createServerFn_handler = createServerRpc({
	id: "36d98cb244899e8b30d45a3da2eed47cbb138a2c35718ba03b7b9b7ddb3e2b08",
	name: "createAssignment",
	filename: "src/lib/planner.functions.ts"
}, (opts) => createAssignment.__executeServer(opts));
var createAssignment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => assignmentInput.parse(d)).handler(createAssignment_createServerFn_handler, async ({ context, data }) => {
	const { data: row, error } = await context.supabase.from("assignments").insert({
		user_id: context.userId,
		title: data.title,
		subject: data.subject ?? null,
		notes: data.notes ?? null,
		due_at: data.due_at ?? null,
		priority: data.priority
	}).select("*").single();
	if (error) throw new Error(error.message);
	return row;
});
var toggleAssignment_createServerFn_handler = createServerRpc({
	id: "991cbdcb894b23af07d7e63ff68029124a18a6318454da2679a0d75180fbdc2f",
	name: "toggleAssignment",
	filename: "src/lib/planner.functions.ts"
}, (opts) => toggleAssignment.__executeServer(opts));
var toggleAssignment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	id: z.string().uuid(),
	status: z.enum(["pending", "done"])
}).parse(d)).handler(toggleAssignment_createServerFn_handler, async ({ context, data }) => {
	const { error } = await context.supabase.from("assignments").update({ status: data.status }).eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var deleteAssignment_createServerFn_handler = createServerRpc({
	id: "236d5fd5d5fae8c5c6619643af1aad0a1037f18046cf5b7e4a0523bcaaad0216",
	name: "deleteAssignment",
	filename: "src/lib/planner.functions.ts"
}, (opts) => deleteAssignment.__executeServer(opts));
var deleteAssignment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(deleteAssignment_createServerFn_handler, async ({ context, data }) => {
	const { error } = await context.supabase.from("assignments").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var listGoals_createServerFn_handler = createServerRpc({
	id: "3e9bab4905fe8f1595d55437fa1a932f68c77b0cb724a29dd74a42a275f1e351",
	name: "listGoals",
	filename: "src/lib/planner.functions.ts"
}, (opts) => listGoals.__executeServer(opts));
var listGoals = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listGoals_createServerFn_handler, async ({ context }) => {
	const { data, error } = await context.supabase.from("study_goals").select("*").eq("user_id", context.userId).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
});
var createGoal_createServerFn_handler = createServerRpc({
	id: "836a52dc1f22264ce9b6bb9b0f7a3299aa2492ebf9d287e0c1e91f7013901d4a",
	name: "createGoal",
	filename: "src/lib/planner.functions.ts"
}, (opts) => createGoal.__executeServer(opts));
var createGoal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	title: z.string().min(1).max(120),
	target_minutes: z.number().int().min(15).max(1e4),
	period: z.enum(["weekly", "monthly"]).default("weekly")
}).parse(d)).handler(createGoal_createServerFn_handler, async ({ context, data }) => {
	const { data: row, error } = await context.supabase.from("study_goals").insert({
		user_id: context.userId,
		title: data.title,
		target_minutes: data.target_minutes,
		period: data.period
	}).select("*").single();
	if (error) throw new Error(error.message);
	return row;
});
var deleteGoal_createServerFn_handler = createServerRpc({
	id: "5a573b9b3e1f818179b647dd446ef8ed9e8faef5818ff760dee4dacd26564386",
	name: "deleteGoal",
	filename: "src/lib/planner.functions.ts"
}, (opts) => deleteGoal.__executeServer(opts));
var deleteGoal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(deleteGoal_createServerFn_handler, async ({ context, data }) => {
	const { error } = await context.supabase.from("study_goals").delete().eq("id", data.id).eq("user_id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
var logSession_createServerFn_handler = createServerRpc({
	id: "463b76d2b72d32c1f32df6659ce354aec19f719c42546468785bd4196137e20f",
	name: "logSession",
	filename: "src/lib/planner.functions.ts"
}, (opts) => logSession.__executeServer(opts));
var logSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	subject: z.string().max(80).optional().nullable(),
	duration_seconds: z.number().int().min(1).max(3600 * 8)
}).parse(d)).handler(logSession_createServerFn_handler, async ({ context, data }) => {
	const { error } = await context.supabase.from("study_sessions").insert({
		user_id: context.userId,
		subject: data.subject ?? null,
		duration_seconds: data.duration_seconds,
		ended_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
var getStudyStats_createServerFn_handler = createServerRpc({
	id: "48c9d22c8489bfd4c211a1880d5eb8c6ebc89753110f6b8c99a507b0f92a7239",
	name: "getStudyStats",
	filename: "src/lib/planner.functions.ts"
}, (opts) => getStudyStats.__executeServer(opts));
var getStudyStats = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getStudyStats_createServerFn_handler, async ({ context }) => {
	const since = /* @__PURE__ */ new Date();
	since.setDate(since.getDate() - 30);
	const { data, error } = await context.supabase.from("study_sessions").select("duration_seconds, started_at").eq("user_id", context.userId).gte("started_at", since.toISOString()).order("started_at", { ascending: false });
	if (error) throw new Error(error.message);
	const sessions = data ?? [];
	const todayStart = /* @__PURE__ */ new Date();
	todayStart.setHours(0, 0, 0, 0);
	const weekStart = /* @__PURE__ */ new Date();
	weekStart.setDate(weekStart.getDate() - 7);
	const todaySec = sessions.filter((s) => new Date(s.started_at) >= todayStart).reduce((a, b) => a + (b.duration_seconds ?? 0), 0);
	const weekSec = sessions.filter((s) => new Date(s.started_at) >= weekStart).reduce((a, b) => a + (b.duration_seconds ?? 0), 0);
	const days = new Set(sessions.map((s) => new Date(s.started_at).toISOString().slice(0, 10)));
	let streak = 0;
	const cursor = /* @__PURE__ */ new Date();
	for (;;) {
		const key = cursor.toISOString().slice(0, 10);
		if (days.has(key)) {
			streak += 1;
			cursor.setDate(cursor.getDate() - 1);
		} else break;
	}
	return {
		todayMinutes: Math.round(todaySec / 60),
		weekMinutes: Math.round(weekSec / 60),
		totalSessions: sessions.length,
		streak
	};
});
//#endregion
export { createAssignment_createServerFn_handler, createGoal_createServerFn_handler, deleteAssignment_createServerFn_handler, deleteGoal_createServerFn_handler, getStudyStats_createServerFn_handler, listAssignments_createServerFn_handler, listGoals_createServerFn_handler, logSession_createServerFn_handler, toggleAssignment_createServerFn_handler };
