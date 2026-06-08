import { createFileRoute } from "@tanstack/react-router";
import { ProgramsCrud } from "#/features/dashboard/screens/ProgramsCrud";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";
import { requireRole } from "#/shared/lib/route-guards";
import { Role } from "#/shared/types";

export const Route = createFileRoute("/dashboard/programs")({
	component: ProgramsCrud,
	beforeLoad: () => requireRole([Role.ADMIN]),
	notFoundComponent: () => <RouteNotFoundState scope="carreras y programas" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="carreras y programas" />
	),
});
