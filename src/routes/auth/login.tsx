import { createFileRoute } from "@tanstack/react-router";
import { Login } from "#/features/auth/components/Login";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";

export const Route = createFileRoute("/auth/login")({
	component: AuthLoginRoute,
	notFoundComponent: () => <RouteNotFoundState scope="autenticación" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="autenticación" />
	),
});

function AuthLoginRoute() {
	return <Login />;
}
