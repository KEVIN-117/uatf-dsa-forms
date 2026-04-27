import { StudentReport } from '#/features/reports/student'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student-report/$formId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { formId } = Route.useParams()
  return <StudentReport formId={formId} />
}
