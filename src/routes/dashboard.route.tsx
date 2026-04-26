import { AdminPanel } from '#/features/dashboard/screens/AdminPanel'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: AdminPanel,
})

