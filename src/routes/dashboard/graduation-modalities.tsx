import { GraduationModalitiesCrud } from '#/features/dashboard/screens/GraduationModalitiesCrud'
import { createFileRoute } from '@tanstack/react-router'
import { RouteErrorState, RouteNotFoundState } from '#/shared/components/routing/RouteState'
import { requireRole } from '#/shared/lib/route-guards'
import { Role } from '#/shared/types'

export const Route = createFileRoute('/dashboard/graduation-modalities')({
  component: GraduationModalitiesCrud,
  beforeLoad: () => requireRole([Role.ADMIN]),
  notFoundComponent: () => <RouteNotFoundState scope="modalidades de graduación" />,
  errorComponent: ({ error }) => <RouteErrorState error={error} scope="modalidades de graduación" />,
})
