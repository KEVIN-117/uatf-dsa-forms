import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { SidebarProvider } from '#/shared/ui/sidebar'
import { DashboardSidebar } from '#/app/layout/DashboardSidebar'

import { AuthProvider } from '#/features/auth/providers/AuthProvider'
import { DirectorProfileGate } from '#/features/director-profile/components/DirectorProfileGate'
import { Toaster } from "@/shared/ui/sonner"
import { RouteErrorState, RouteNotFoundState } from "#/shared/components/routing/RouteState"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Formularios UATF' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' }
    ],
  }),
  notFoundComponent: () => <RouteNotFoundState scope="la aplicación" />,
  errorComponent: ({ error }) => <RouteErrorState error={error} scope="la aplicación" />,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <AuthProvider>
          <SidebarProvider className='bg-sidebar'>
            <DashboardSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
              <div className="lg:border lg:rounded-md overflow-hidden flex flex-col h-full w-full bg-background">
                <main className="w-full flex-1 overflow-auto p-1">
                  {children}
                </main>
                <Toaster />
              </div>
            </div>
          </SidebarProvider>
          <DirectorProfileGate />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
