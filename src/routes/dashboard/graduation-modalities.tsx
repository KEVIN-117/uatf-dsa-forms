import { GraduationModalitiesCrud } from '#/features/dashboard/screens/GraduationModalitiesCrud'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/graduation-modalities')({
  component: GraduationModalitiesCrud,
})
