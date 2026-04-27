import FormBuilderPanel from '#/features/dashboard/screens/FormBuilderPanel';
import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/dashboard/form-builder')({
  component: FormBuilderPanel,
});