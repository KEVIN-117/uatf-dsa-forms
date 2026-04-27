import { TablePanel } from '#/features/dashboard/screens/TablePanel'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/dashboard/table')({
  component: TablePanel,
})

