import { ScholarshipReport } from '#/features/reports/scholarship';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/scholarship-report/$formId')({
  component: ScholarshipReportPage,
})

export function ScholarshipReportPage() {
  const { formId } = Route.useParams();

  return (
    <ScholarshipReport formId={formId} />
  );
}