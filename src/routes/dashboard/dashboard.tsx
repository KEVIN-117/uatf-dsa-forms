import { createFileRoute } from "@tanstack/react-router";
import { DashboardHome } from "#/features/dashboard/screens/DashboardHome";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";
import { requireRole } from "#/shared/lib/route-guards";
import { Role } from "#/shared/types";

export const Route = createFileRoute("/dashboard/dashboard")({
	component: RouteComponent,
	beforeLoad: () => requireRole([Role.ADMIN, Role.DIRECTOR]),
	notFoundComponent: () => <RouteNotFoundState scope="dashboard" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="dashboard" />
	),
});

function RouteComponent() {
	return <DashboardHome />;
}
