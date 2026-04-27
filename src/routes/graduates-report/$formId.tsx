import { GraduatesReport } from '#/features/reports/graduates'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/graduates-report/$formId')({
  component: GraduatesReportPage,
})

function GraduatesReportPage() {
  const { formId } = Route.useParams()
  return <GraduatesReport formId={formId} />
}
