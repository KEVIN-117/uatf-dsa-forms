import { createFileRoute } from "@tanstack/react-router";
import FormBuilderPanel from "#/features/dashboard/screens/FormBuilderPanel";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";
import { requireRole } from "#/shared/lib/route-guards";
import { Role } from "#/shared/types";

export const Route = createFileRoute("/dashboard/form-builder")({
	component: FormBuilderPanel,
	beforeLoad: () => requireRole([Role.ADMIN]),
	notFoundComponent: () => (
		<RouteNotFoundState scope="constructor de formularios" />
	),
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="constructor de formularios" />
	),
});
