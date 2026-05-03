import { AdminPanel } from '#/features/dashboard/screens/AdminPanel'
import { createFileRoute } from '@tanstack/react-router'
import { RouteErrorState, RouteNotFoundState } from '#/shared/components/routing/RouteState'
import { requireRole } from '#/shared/lib/route-guards'
import { Role } from '#/shared/types'

export const Route = createFileRoute('/dashboard/admin')({
  component: AdminPanel,
  beforeLoad: () => requireRole([Role.ADMIN]),
  notFoundComponent: () => <RouteNotFoundState scope="panel de administración" />,
  errorComponent: ({ error }) => <RouteErrorState error={error} scope="panel de administración" />,
})
