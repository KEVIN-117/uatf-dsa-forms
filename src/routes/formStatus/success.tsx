import { createFileRoute } from '@tanstack/react-router'
import { FormSuccess } from '#/shared/components/FormSuccess'
import { RouteErrorState, RouteNotFoundState } from '#/shared/components/routing/RouteState'

export const Route = createFileRoute('/formStatus/success')({
  component: FormSuccess,
  notFoundComponent: () => <RouteNotFoundState scope="estado de formulario" />,
  errorComponent: ({ error }) => <RouteErrorState error={error} scope="estado de formulario" />,
})
