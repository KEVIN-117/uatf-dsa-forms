import { GraduatesReport } from '#/features/reports/graduates'
import { createFileRoute } from '@tanstack/react-router'
import { RouteErrorState, RouteNotFoundState } from '#/shared/components/routing/RouteState'
import { requireRole } from '#/shared/lib/route-guards'
import { Role } from '#/shared/types'

export const Route = createFileRoute('/graduates-report/$formId')({
  component: GraduatesReportPage,
  beforeLoad: () => requireRole([Role.ADMIN, Role.DIRECTOR]),
  notFoundComponent: () => <RouteNotFoundState scope="Reporte de graduados" />,
  errorComponent: ({ error }) => <RouteErrorState error={error} scope="Reporte de graduados" />,
})

function GraduatesReportPage() {
  const { formId } = Route.useParams()
  return <GraduatesReport formId={formId} />
}
