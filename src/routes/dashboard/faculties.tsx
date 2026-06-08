import { createFileRoute } from "@tanstack/react-router";
import { FacultiesCrud } from "#/features/dashboard/screens/FacultiesCrud";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";
import { requireRole } from "#/shared/lib/route-guards";
import { Role } from "#/shared/types";

export const Route = createFileRoute("/dashboard/faculties")({
	component: FacultiesCrud,
	beforeLoad: () => requireRole([Role.ADMIN]),
	notFoundComponent: () => <RouteNotFoundState scope="facultades" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="facultades" />
	),
});
