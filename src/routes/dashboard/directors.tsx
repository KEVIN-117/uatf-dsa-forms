import { createFileRoute } from "@tanstack/react-router";
import { DirectorsCrud } from "#/features/dashboard/screens/DirectorsCrud";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";
import { requireRole } from "#/shared/lib/route-guards";
import { Role } from "#/shared/types";

export const Route = createFileRoute("/dashboard/directors")({
	component: DirectorsCrud,
	beforeLoad: () => requireRole([Role.ADMIN]),
	notFoundComponent: () => <RouteNotFoundState scope="gestión de directores" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="gestión de directores" />
	),
});
