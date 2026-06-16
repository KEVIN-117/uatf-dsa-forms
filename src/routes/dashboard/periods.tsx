import { createFileRoute } from "@tanstack/react-router";
import { PeriodsCrud } from "#/features/dashboard/screens/PeriodsCrud";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";
import { requireRole } from "#/shared/lib/route-guards";
import { Role } from "#/shared/types";

export const Route = createFileRoute("/dashboard/periods")({
	component: PeriodsCrud,
	beforeLoad: () => requireRole([Role.ADMIN]),
	notFoundComponent: () => <RouteNotFoundState scope="gestión de periodos" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="gestión de periodos" />
	),
});
