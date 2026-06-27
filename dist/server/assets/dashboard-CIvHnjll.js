import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_authenticated/dashboard.tsx
var $$splitComponentImporter = () => import("./dashboard-DFQ7RA4U.js");
var Route = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — StudySpark" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
