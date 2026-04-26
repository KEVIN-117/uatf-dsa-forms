import {
  HeadContent,
  Outlet, // Agregamos Outlet
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import Header from '#/app/layout/Header'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { SidebarProvider } from '#/shared/ui/sidebar'
import { DashboardSidebar } from '#/app/layout/DashboardSidebar'

import { AuthProvider } from '#/features/auth/providers/AuthProvider'
import { DirectorProfileGate } from '#/features/director-profile/components/DirectorProfileGate'
import { DirectorProfileProvider } from '#/features/director-profile/providers/DirectorProfileProvider'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Haute Pâtisserie' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
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
          <DirectorProfileProvider>
            <SidebarProvider className='bg-sidebar'>
              <DashboardSidebar />
              <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col h-full w-full bg-background">
                  <Header />
                  <main className="w-full flex-1 overflow-auto p-1">
                    {children}
                  </main>
                </div>
              </div>
            </SidebarProvider>
            <DirectorProfileGate />
          </DirectorProfileProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
