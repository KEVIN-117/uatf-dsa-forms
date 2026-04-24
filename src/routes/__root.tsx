import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import Header from '../components/Header'


import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { SidebarProvider } from '#/components/ui/sidebar'
import { DashboardSidebar } from "@/components/sidebar";

interface MyRouterContext {
  queryClient: QueryClient
}


export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
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
        <Scripts />
      </body>
    </html>
  )
}
