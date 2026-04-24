import { AdminPanel } from '#/pages/dashboard/admin-panel'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: AdminPanel,
})
