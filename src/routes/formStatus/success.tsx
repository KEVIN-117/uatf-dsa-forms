import { createFileRoute } from '@tanstack/react-router'
import { FormSuccess } from '#/shared/components/FormSuccess'

export const Route = createFileRoute('/formStatus/success')({
  component: FormSuccess,
})
