import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import {
  getContext,
} from '#/app/providers/query-provider'

type RouterConfig = Parameters<typeof createTanStackRouter>[0]

export function getRouter(options: Pick<RouterConfig, 'history'> = {}) {
  const context = getContext()

  const router = createTanStackRouter({
    routeTree,
    context,
    history: options.history,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

