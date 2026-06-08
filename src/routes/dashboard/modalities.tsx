import { createFileRoute } from "@tanstack/react-router";
import { ModalitiesCrud } from "#/features/dashboard/screens/ModalitiesCrud";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";
import { requireRole } from "#/shared/lib/route-guards";
import { Role } from "#/shared/types";

export const Route = createFileRoute("/dashboard/modalities")({
	component: ModalitiesCrud,
	beforeLoad: () => requireRole([Role.ADMIN]),
	notFoundComponent: () => (
		<RouteNotFoundState scope="modalidades de ingreso" />
	),
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="modalidades de ingreso" />
	),
});
