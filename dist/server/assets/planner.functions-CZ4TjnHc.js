import { r as createServerFn } from "./esm-B5zcwdrx.js";
import { t as createSsrRpc } from "./createSsrRpc-DfY1OTDB.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CQsR9LLs.js";
import { z } from "zod";
//#region src/lib/planner.functions.ts
var listAssignments = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("83db0b33fc64765da944179583f0109a14af13ddbaa7b20f60032e563a0c6bb7"));
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
var createAssignment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => assignmentInput.parse(d)).handler(createSsrRpc("36d98cb244899e8b30d45a3da2eed47cbb138a2c35718ba03b7b9b7ddb3e2b08"));
var toggleAssignment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	id: z.string().uuid(),
	status: z.enum(["pending", "done"])
}).parse(d)).handler(createSsrRpc("991cbdcb894b23af07d7e63ff68029124a18a6318454da2679a0d75180fbdc2f"));
var deleteAssignment = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(createSsrRpc("236d5fd5d5fae8c5c6619643af1aad0a1037f18046cf5b7e4a0523bcaaad0216"));
var listGoals = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3e9bab4905fe8f1595d55437fa1a932f68c77b0cb724a29dd74a42a275f1e351"));
var createGoal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	title: z.string().min(1).max(120),
	target_minutes: z.number().int().min(15).max(1e4),
	period: z.enum(["weekly", "monthly"]).default("weekly")
}).parse(d)).handler(createSsrRpc("836a52dc1f22264ce9b6bb9b0f7a3299aa2492ebf9d287e0c1e91f7013901d4a"));
var deleteGoal = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(createSsrRpc("5a573b9b3e1f818179b647dd446ef8ed9e8faef5818ff760dee4dacd26564386"));
var logSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	subject: z.string().max(80).optional().nullable(),
	duration_seconds: z.number().int().min(1).max(3600 * 8)
}).parse(d)).handler(createSsrRpc("463b76d2b72d32c1f32df6659ce354aec19f719c42546468785bd4196137e20f"));
var getStudyStats = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("48c9d22c8489bfd4c211a1880d5eb8c6ebc89753110f6b8c99a507b0f92a7239"));
//#endregion
export { getStudyStats as a, logSession as c, deleteGoal as i, toggleAssignment as l, createGoal as n, listAssignments as o, deleteAssignment as r, listGoals as s, createAssignment as t };
