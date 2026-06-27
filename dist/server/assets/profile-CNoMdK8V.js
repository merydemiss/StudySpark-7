import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_authenticated/profile.tsx
var $$splitComponentImporter = () => import("./profile-DDo1ovrH.js");
var Route = createFileRoute("/_authenticated/profile")({
	head: () => ({ meta: [{ title: "Profile — StudySpark" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
