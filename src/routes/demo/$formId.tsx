import { createFileRoute, notFound } from '@tanstack/react-router';
import { DynamicForm } from '#/shared/components/DynamicForm';
import { useFormTemplateById } from '#/shared/hooks/useFormBuilder';
import { auth } from '#/shared/lib/firebase';
import { DynamicReportPageSkeleton } from '#/shared/components/DynamicReportPageSkeleton';
import { DynamicReportPageState } from '#/shared/components/DynamicReportPageState';

export const Route = createFileRoute('/demo/$formId')({
  component: DynamicReportPage,
});

function DynamicReportPage() {
  const { formId } = Route.useParams();
  const { template, isPending, isError, error } = useFormTemplateById(formId);

  const handleFormSubmit = async (
    data: Record<string, unknown>,
    module: string,
  ) => {
    try {
      const currentUser = auth.currentUser;

      console.log('data', data);
      console.log('module', module);
      console.log('template', template);
      console.log('currentUser', currentUser);

      alert('El reporte se ha guardado correctamente en la base de datos.');
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      alert('Hubo un error al procesar el reporte.');
    }
  };

  if (isPending) {
    return <DynamicReportPageSkeleton />;
  }

  if (isError) {
    return (
      <DynamicReportPageState
        title="No se pudo cargar el formulario"
        description={
          error instanceof Error
            ? error.message
            : 'Ocurrió un error al recuperar la plantilla desde la base de datos.'
        }
      />
    );
  }

  if (!template) {
    throw notFound();
  }

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-primary/60">
          Módulo: {template.module.replace('_', ' ')}
        </span>
        <h1 className="text-3xl font-display font-bold mt-2">Gestión de Reportes</h1>
      </div>

      <DynamicForm
        template={template}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
