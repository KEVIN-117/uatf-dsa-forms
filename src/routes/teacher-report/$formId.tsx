import { createFileRoute } from "@tanstack/react-router";
import { TeacherReport } from "#/features/reports/teacher";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";
import { requireRole } from "#/shared/lib/route-guards";
import { Role } from "#/shared/types";

export const Route = createFileRoute("/teacher-report/$formId")({
	component: TeacherReportPage,
	beforeLoad: () => requireRole([Role.ADMIN, Role.DIRECTOR]),
	notFoundComponent: () => <RouteNotFoundState scope="reporte docente" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="reporte docente" />
	),
});

export function TeacherReportPage() {
	const { formId } = Route.useParams();
	return <TeacherReport formId={formId} />;
}
