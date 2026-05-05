import { StudentReport } from '#/features/reports/student'
import { createFileRoute } from '@tanstack/react-router'
import { RouteErrorState, RouteNotFoundState } from '#/shared/components/routing/RouteState'
import { requireRole } from '#/shared/lib/route-guards'
import { Role } from '#/shared/types'

export const Route = createFileRoute('/student-report/$formId')({
  component: RouteComponent,
  beforeLoad: () => requireRole([Role.ADMIN, Role.DIRECTOR]),
  notFoundComponent: () => <RouteNotFoundState scope="reporte de estudiantes" />,
  errorComponent: ({ error }) => <RouteErrorState error={error} scope="reporte de estudiantes" />,
})

function RouteComponent() {
  const { formId } = Route.useParams()
  return <StudentReport formId={formId} />
}
