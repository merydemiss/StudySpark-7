//#region \0%23tanstack-start-server-fn-resolver
var manifest = {
	"ebbbc99857ac917fa22c2b1d438323ae8fd03205b61e4f2e84e349f57ca98c3c": {
		functionName: "listThreads_createServerFn_handler",
		importer: () => import("./threads.functions-CAZ_aZ1G.js")
	},
	"67dca520864171111cdf48efef1043d4a0da2d685a1c0b4280bd5013be4b79c9": {
		functionName: "createThread_createServerFn_handler",
		importer: () => import("./threads.functions-CAZ_aZ1G.js")
	},
	"568557aff3b98c509b2e18e3b33bc94e0f42eaf3bf5efa80b0f9c8e64ed87602": {
		functionName: "deleteThread_createServerFn_handler",
		importer: () => import("./threads.functions-CAZ_aZ1G.js")
	},
	"4de48302a58b8017a3864af8f5d4bfff1891bb7bbd691f1f10fb1c616272eab8": {
		functionName: "getThreadMessages_createServerFn_handler",
		importer: () => import("./threads.functions-CAZ_aZ1G.js")
	},
	"ca5f3f8cf8ec7e39c84e6e9d37bd9b91462cf84a252eb8704a4aa6fddabdaab9": {
		functionName: "updateThreadDifficulty_createServerFn_handler",
		importer: () => import("./threads.functions-CAZ_aZ1G.js")
	},
	"8c6016df94df755859f504c92677f7275e4d40af73762d0905338113191d1474": {
		functionName: "listNotes_createServerFn_handler",
		importer: () => import("./notes.functions-BWb-1Tbs.js")
	},
	"97031b97c3b00aa95e7c2afc09de32de3e01610b2da73c3f7036f9e8c1dd8c6f": {
		functionName: "getNote_createServerFn_handler",
		importer: () => import("./notes.functions-BWb-1Tbs.js")
	},
	"a5208b3e264091f6aa64b115bd63613e1b53f409fd60c01f55e8eb3a55fd9577": {
		functionName: "deleteNote_createServerFn_handler",
		importer: () => import("./notes.functions-BWb-1Tbs.js")
	},
	"3cba125e8193fc87f26b66d1cf56990a4671b43f0f4d8524501934d97b7dd750": {
		functionName: "createAndAnalyzeNote_createServerFn_handler",
		importer: () => import("./notes.functions-BWb-1Tbs.js")
	},
	"83db0b33fc64765da944179583f0109a14af13ddbaa7b20f60032e563a0c6bb7": {
		functionName: "listAssignments_createServerFn_handler",
		importer: () => import("./planner.functions-XIe2b3Z5.js")
	},
	"36d98cb244899e8b30d45a3da2eed47cbb138a2c35718ba03b7b9b7ddb3e2b08": {
		functionName: "createAssignment_createServerFn_handler",
		importer: () => import("./planner.functions-XIe2b3Z5.js")
	},
	"991cbdcb894b23af07d7e63ff68029124a18a6318454da2679a0d75180fbdc2f": {
		functionName: "toggleAssignment_createServerFn_handler",
		importer: () => import("./planner.functions-XIe2b3Z5.js")
	},
	"236d5fd5d5fae8c5c6619643af1aad0a1037f18046cf5b7e4a0523bcaaad0216": {
		functionName: "deleteAssignment_createServerFn_handler",
		importer: () => import("./planner.functions-XIe2b3Z5.js")
	},
	"3e9bab4905fe8f1595d55437fa1a932f68c77b0cb724a29dd74a42a275f1e351": {
		functionName: "listGoals_createServerFn_handler",
		importer: () => import("./planner.functions-XIe2b3Z5.js")
	},
	"836a52dc1f22264ce9b6bb9b0f7a3299aa2492ebf9d287e0c1e91f7013901d4a": {
		functionName: "createGoal_createServerFn_handler",
		importer: () => import("./planner.functions-XIe2b3Z5.js")
	},
	"5a573b9b3e1f818179b647dd446ef8ed9e8faef5818ff760dee4dacd26564386": {
		functionName: "deleteGoal_createServerFn_handler",
		importer: () => import("./planner.functions-XIe2b3Z5.js")
	},
	"463b76d2b72d32c1f32df6659ce354aec19f719c42546468785bd4196137e20f": {
		functionName: "logSession_createServerFn_handler",
		importer: () => import("./planner.functions-XIe2b3Z5.js")
	},
	"48c9d22c8489bfd4c211a1880d5eb8c6ebc89753110f6b8c99a507b0f92a7239": {
		functionName: "getStudyStats_createServerFn_handler",
		importer: () => import("./planner.functions-XIe2b3Z5.js")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
