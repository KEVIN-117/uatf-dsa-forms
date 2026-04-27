import { ResponsesPanel } from '#/features/dashboard/screens/ResponsesPanel';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/reports/$templateId/$module')({
    component: RouteComponent,
})

function RouteComponent() {
    const { templateId, module } = Route.useParams();
    return <ResponsesPanel formId={templateId} module={module} />
}
