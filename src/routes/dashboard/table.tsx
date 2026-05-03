import { TablePanel } from '#/features/dashboard/screens/TablePanel'
import { createFileRoute } from '@tanstack/react-router'
import { RouteErrorState, RouteNotFoundState } from '#/shared/components/routing/RouteState'
import { requireRole } from '#/shared/lib/route-guards'
import { Role } from '#/shared/types'


export const Route = createFileRoute('/dashboard/table')({
  component: TablePanel,
  beforeLoad: () => requireRole([Role.ADMIN]),
  notFoundComponent: () => <RouteNotFoundState scope="tabla demo" />,
  errorComponent: ({ error }) => <RouteErrorState error={error} scope="tabla demo" />,
})
