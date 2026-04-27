import { DynamicForm } from "#/shared/components/DynamicForm";
import { notFound } from '@tanstack/react-router';
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import { useDirectorProfile } from "../director-profile/providers/DirectorProfileProvider";
import { useSubmitFormResponse } from "#/shared/hooks/useFormResponses";
import type { FormModules } from "#/shared/types/dynamic-form";
import { toast } from "sonner";

interface GraduatesReportProps {
    formId: string;
}

export function GraduatesReport({ formId }: GraduatesReportProps) {
    const { template, isPending, isError, error } = useFormTemplateByModuleAndId('graduate', formId);
    const { mutateAsync } = useSubmitFormResponse();
    const { profile } = useDirectorProfile();

    const handleFormSubmit = async (
        data: Record<string, unknown>,
        module: string,
    ) => {
        try {
            const tranformedData = Object.entries(data).reduce((acc, [key, value]) => {
                const [_id, name] = key.split('@');
                acc[name] = value;
                return acc;
            }, {} as Record<string, unknown>);

            if (!template) {
                throw new Error('Template no encontrado');
            }
            if (!profile) {
                throw new Error('Profile no encontrado');
            }
            mutateAsync({
                id: crypto.randomUUID(),
                templateId: template?.id,
                module: module as FormModules,
                submittedBy: profile?.fullName,
                createdAt: Date.now(),
                response: tranformedData,
            });

            toast.success("Reporte guardado exitosamente", {
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                className: "bg-primary",
                description: `El reporte ha sido guardado correctamente. ${profile?.fullName} con estos datos: ${JSON.stringify(data, null, 2)}  `,
            });
        } catch (error: unknown) {
            toast.error("Error al guardar el reporte", {
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                className: "bg-primary",
                description: error instanceof Error ? error.message : "Error desconocido",
            });
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
        <div className="container mx-auto py-10">
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