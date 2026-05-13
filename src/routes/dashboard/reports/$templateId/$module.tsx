import { ResponsesPanel } from '#/features/dashboard/screens/ResponsesPanel';
import { createFileRoute } from '@tanstack/react-router'
import { RouteErrorState, RouteNotFoundState } from '#/shared/components/routing/RouteState';
import { requireRole } from '#/shared/lib/route-guards';
import { Role } from '#/shared/types';
import type { FormModules } from '#/shared/types/dynamic-form';

export const Route = createFileRoute('/dashboard/reports/$templateId/$module')({
    component: RouteComponent,
    beforeLoad: () => requireRole([Role.ADMIN]),
    notFoundComponent: () => <RouteNotFoundState scope="resultados de reportes" />,
    errorComponent: ({ error }) => <RouteErrorState error={error} scope="resultados de reportes" />,
})

function RouteComponent() {
    const { templateId, module } = Route.useParams();
    return <ResponsesPanel formId={templateId} module={module as FormModules} />
}
