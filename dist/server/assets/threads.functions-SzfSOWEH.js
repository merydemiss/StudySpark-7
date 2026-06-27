import { r as createServerFn } from "./esm-B5zcwdrx.js";
import { t as createSsrRpc } from "./createSsrRpc-DfY1OTDB.js";
import { t as requireSupabaseAuth } from "./auth-middleware-CQsR9LLs.js";
import { z } from "zod";
//#region src/lib/threads.functions.ts
var listThreads = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ebbbc99857ac917fa22c2b1d438323ae8fd03205b61e4f2e84e349f57ca98c3c"));
var createThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ difficulty: z.enum([
	"simple",
	"standard",
	"advanced"
]).default("standard") }).parse(d)).handler(createSsrRpc("67dca520864171111cdf48efef1043d4a0da2d685a1c0b4280bd5013be4b79c9"));
var deleteThread = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(createSsrRpc("568557aff3b98c509b2e18e3b33bc94e0f42eaf3bf5efa80b0f9c8e64ed87602"));
var getThreadMessages = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({ threadId: z.string().uuid() }).parse(d)).handler(createSsrRpc("4de48302a58b8017a3864af8f5d4bfff1891bb7bbd691f1f10fb1c616272eab8"));
var updateThreadDifficulty = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => z.object({
	id: z.string().uuid(),
	difficulty: z.enum([
		"simple",
		"standard",
		"advanced"
	])
}).parse(d)).handler(createSsrRpc("ca5f3f8cf8ec7e39c84e6e9d37bd9b91462cf84a252eb8704a4aa6fddabdaab9"));
//#endregion
export { updateThreadDifficulty as a, listThreads as i, deleteThread as n, getThreadMessages as r, createThread as t };
