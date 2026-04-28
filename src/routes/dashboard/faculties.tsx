import { FacultiesCrud } from '#/features/dashboard/screens/FacultiesCrud'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/faculties')({
  component: FacultiesCrud,
})
