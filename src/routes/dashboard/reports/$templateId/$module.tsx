import { createFileRoute, notFound } from "@tanstack/react-router";
import { ResponsesPanel } from "#/features/dashboard/screens/ResponsesPanel";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";
import { requireRole } from "#/shared/lib/route-guards";
import { Role } from "#/shared/types";
import { FormModules } from "#/shared/types/dynamic-form";

const VALID_MODULES = new Set<string>(Object.values(FormModules));

export const Route = createFileRoute("/dashboard/reports/$templateId/$module")({
	component: RouteComponent,
	beforeLoad: () => requireRole([Role.ADMIN, Role.DIRECTOR]),
	notFoundComponent: () => (
		<RouteNotFoundState scope="resultados de reportes" />
	),
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="resultados de reportes" />
	),
});

function RouteComponent() {
	const { templateId, module } = Route.useParams();

	if (!VALID_MODULES.has(module)) {
		throw notFound();
	}

	return <ResponsesPanel formId={templateId} module={module as FormModules} />;
}
