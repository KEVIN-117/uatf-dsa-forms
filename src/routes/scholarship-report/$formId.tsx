import { createFileRoute } from "@tanstack/react-router";
import { ScholarshipReport } from "#/features/reports/scholarship";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";
import { requireRole } from "#/shared/lib/route-guards";
import { Role } from "#/shared/types";

export const Route = createFileRoute("/scholarship-report/$formId")({
	component: ScholarshipReportPage,
	beforeLoad: () => requireRole([Role.ADMIN, Role.DIRECTOR]),
	notFoundComponent: () => <RouteNotFoundState scope="reporte de becas" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="reporte de becas" />
	),
});

export function ScholarshipReportPage() {
	const { formId } = Route.useParams();

	return <ScholarshipReport formId={formId} />;
}
