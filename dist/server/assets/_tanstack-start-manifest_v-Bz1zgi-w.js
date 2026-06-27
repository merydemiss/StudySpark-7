//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({
	routes: {
		__root__: {
			filePath: "/workspaces/StudySpark-7/src/routes/__root.tsx",
			children: [
				"/",
				"/_authenticated",
				"/auth",
				"/api/chat",
				"/api/tts"
			],
			assets: [{
				tag: "link",
				attrs: {
					rel: "stylesheet",
					href: "/assets/index-1ch5h8LD.css",
					type: "text/css"
				}
			}],
			preloads: [
				"/assets/index-BtyoIHvt.js",
				"/assets/chunk-Cyuzqnbw.js",
				"/assets/QueryClientProvider-Bjr3RRXV.js",
				"/assets/link-5WD15CC_.js",
				"/assets/matchContext-TSB9QAhk.js",
				"/assets/useRouter-DSE1MKKk.js",
				"/assets/jsx-runtime-BwA_5UX2.js"
			]
		},
		"/": {
			filePath: "/workspaces/StudySpark-7/src/routes/index.tsx",
			children: void 0,
			assets: void 0,
			preloads: [
				"/assets/routes-Dy6ERbTs.js",
				"/assets/createLucideIcon-ChvYVYWP.js",
				"/assets/book-open-DioNDLgj.js",
				"/assets/message-square-DAqrYj_D.js",
				"/assets/sparkles-Bqqcvo0N.js",
				"/assets/trophy-DLRNEHPi.js"
			]
		},
		"/_authenticated": {
			filePath: "/workspaces/StudySpark-7/src/routes/_authenticated/route.tsx",
			children: [
				"/_authenticated/dashboard",
				"/_authenticated/notes",
				"/_authenticated/planner",
				"/_authenticated/profile",
				"/_authenticated/tutor",
				"/_authenticated/voice"
			],
			assets: [],
			preloads: [
				"/assets/route-DV5aOJQK.js",
				"/assets/createLucideIcon-ChvYVYWP.js",
				"/assets/book-open-DioNDLgj.js",
				"/assets/log-out-BYt-Yj1Y.js",
				"/assets/message-square-DAqrYj_D.js",
				"/assets/mic-CCgB6sgl.js",
				"/assets/sparkles-Bqqcvo0N.js",
				"/assets/x-DqrKrQLa.js"
			]
		},
		"/auth": {
			filePath: "/workspaces/StudySpark-7/src/routes/auth.tsx",
			children: void 0,
			assets: [],
			preloads: ["/assets/auth-D5JybctH.js", "/assets/sparkles-Bqqcvo0N.js"]
		},
		"/_authenticated/dashboard": {
			filePath: "/workspaces/StudySpark-7/src/routes/_authenticated/dashboard.tsx",
			children: void 0,
			assets: [],
			preloads: [
				"/assets/dashboard-Dk8eQDXZ.js",
				"/assets/auth-middleware-B5fawYih.js",
				"/assets/timer-XlOIJbIq.js",
				"/assets/flame-Jsf-QBT0.js",
				"/assets/plus-CITMmV4U.js",
				"/assets/trophy-DLRNEHPi.js",
				"/assets/notes.functions-LUyQtmpV.js",
				"/assets/threads.functions-Capqay29.js"
			]
		},
		"/_authenticated/notes": {
			filePath: "/workspaces/StudySpark-7/src/routes/_authenticated/notes.tsx",
			children: ["/_authenticated/notes/$noteId"],
			assets: [],
			preloads: [
				"/assets/notes-DGqwRr3D.js",
				"/assets/trash-2-D0ntTedY.js",
				"/assets/auth-middleware-B5fawYih.js",
				"/assets/plus-CITMmV4U.js",
				"/assets/notes.functions-LUyQtmpV.js"
			]
		},
		"/_authenticated/planner": {
			filePath: "/workspaces/StudySpark-7/src/routes/_authenticated/planner.tsx",
			children: void 0,
			assets: [],
			preloads: [
				"/assets/planner-Dk5xyU79.js",
				"/assets/trash-2-D0ntTedY.js",
				"/assets/auth-middleware-B5fawYih.js",
				"/assets/timer-XlOIJbIq.js",
				"/assets/flame-Jsf-QBT0.js",
				"/assets/play-AlYLYPdE.js",
				"/assets/plus-CITMmV4U.js"
			]
		},
		"/_authenticated/profile": {
			filePath: "/workspaces/StudySpark-7/src/routes/_authenticated/profile.tsx",
			children: void 0,
			assets: [],
			preloads: [
				"/assets/profile-lJoIgZRB.js",
				"/assets/auth-middleware-B5fawYih.js",
				"/assets/flame-Jsf-QBT0.js",
				"/assets/trophy-DLRNEHPi.js",
				"/assets/notes.functions-LUyQtmpV.js",
				"/assets/threads.functions-Capqay29.js"
			]
		},
		"/_authenticated/tutor": {
			filePath: "/workspaces/StudySpark-7/src/routes/_authenticated/tutor.tsx",
			children: ["/_authenticated/tutor/$threadId"],
			assets: [],
			preloads: [
				"/assets/tutor-BEIbWmJF.js",
				"/assets/trash-2-D0ntTedY.js",
				"/assets/auth-middleware-B5fawYih.js",
				"/assets/threads.functions-Capqay29.js"
			]
		},
		"/_authenticated/voice": {
			filePath: "/workspaces/StudySpark-7/src/routes/_authenticated/voice.tsx",
			children: void 0,
			assets: [],
			preloads: [
				"/assets/voice-V0vSm2En.js",
				"/assets/dist-77awvor-.js",
				"/assets/play-AlYLYPdE.js"
			]
		},
		"/_authenticated/notes/$noteId": {
			filePath: "/workspaces/StudySpark-7/src/routes/_authenticated/notes.$noteId.tsx",
			children: void 0,
			assets: [],
			preloads: ["/assets/notes._noteId-CTYcums_.js"]
		},
		"/_authenticated/tutor/$threadId": {
			filePath: "/workspaces/StudySpark-7/src/routes/_authenticated/tutor.$threadId.tsx",
			children: void 0,
			assets: [],
			preloads: [
				"/assets/tutor._threadId-95cigm2F.js",
				"/assets/chunk-O5CBEL6O-D7ig5Rfz.js",
				"/assets/chunk-BO2N2NFS-DjYnaDLx.js",
				"/assets/src-D-NMWEou.js",
				"/assets/chunk-5ZQYHXKU-B1_sVkBs.js",
				"/assets/chunk-CSCIHK7Q-JRmFaPhR.js",
				"/assets/dist-77awvor-.js",
				"/assets/chunk-3OPIFGDE-BG_nnxrC.js",
				"/assets/chunk-BSJP7CBP-DIpfLhEz.js",
				"/assets/chunk-KSCS5N6A-DybRHiLb.js",
				"/assets/chunk-L5ZTLDWV-D_k2NP6f.js",
				"/assets/chunk-LZXEDZCA-D8Cdtzk0.js",
				"/assets/chunk-NZK2D7GU-CKleilwl.js",
				"/assets/chunk-WU5MYG2G-CYnymQcx.js",
				"/assets/chunk-XPW4576I-ru3A962d.js"
			]
		}
	},
	clientEntry: "/assets/index-BtyoIHvt.js"
});
//#endregion
export { tsrStartManifest };
