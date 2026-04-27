import { createElement } from 'react'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { renderToString } from 'react-dom/server'
import { getRouter } from './router'

export async function render(url: string) {
  const router = getRouter({
    history: createMemoryHistory({
      initialEntries: [url],
    }),
  })

  await router.load()

  const html = renderToString(
    createElement(RouterProvider, {
      router,
    }),
  )

  return {
    html,
  }
}
