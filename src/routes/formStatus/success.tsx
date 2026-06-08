import { createFileRoute } from "@tanstack/react-router";
import { FormSuccessPage } from "#/features/reports/screens/FormSuccessPage";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";

export const Route = createFileRoute("/formStatus/success")({
	component: FormSuccessPage,
	validateSearch: (search: Record<string, unknown>) => ({
		completed: search.completed === true || search.completed === "true",
	}),
	notFoundComponent: () => <RouteNotFoundState scope="estado de formulario" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="estado de formulario" />
	),
});
