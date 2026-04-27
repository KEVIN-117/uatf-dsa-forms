import { TeacherReport } from '#/features/reports/teacher';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teacher-report/$formId')({
  component: TeacherReportPage,
})

export function TeacherReportPage() {
  const { formId } = Route.useParams();
  return (
    <TeacherReport formId={formId} />
  );
}
