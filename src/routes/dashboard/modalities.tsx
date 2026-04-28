import { ModalitiesCrud } from '#/features/dashboard/screens/ModalitiesCrud'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/modalities')({
  component: ModalitiesCrud,
})
