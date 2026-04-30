import { DynamicForm } from "#/shared/components/DynamicForm";
import { notFound, useNavigate } from '@tanstack/react-router';
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import type { FormModules } from "#/shared/types/dynamic-form";
import { useSubmitFormResponse } from "#/shared/hooks/useFormResponses";
import { useDirectorProfile } from "../director-profile/providers/DirectorProfileProvider";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { useState } from "react";
import { useToast } from "#/shared/components/Toast";
import { useGetNextTemplateUrl } from "#/shared/hooks/useNextFormRoute";
import { useMarkStepCompleted } from "#/shared/hooks/useDirectorProgress";

interface ScholarshipReportProps {
    formId: string;
}

export function ScholarshipReport({ formId }: ScholarshipReportProps) {
    // 1. HOOK ZONE
    const { template, isPending, isError, error } = useFormTemplateByModuleAndId('scholarships', formId);
    const { mutateAsync } = useSubmitFormResponse();
    const { mutateAsync: markStepCompleted } = useMarkStepCompleted();
    const { profile } = useDirectorProfile();
    const navigate = useNavigate();
    const nextUrl = useGetNextTemplateUrl(formId);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pendingData, setPendingData] = useState<{ data: Record<string, unknown>, module: string } | null>(null);

    // 2. FUNCTIONS AND LOGIC
    const handleFormSubmitRequest = async (data: Record<string, unknown>, module: string) => {
        setPendingData({ data, module });
        setIsDialogOpen(true);
    };

    const executeSubmit = async () => {
        if (!pendingData || !template || !profile) return;

        const { data, module } = pendingData;
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
            await mutateAsync({
                id: crypto.randomUUID(),
                templateId: template?.id,
                module: module as FormModules,
                submittedBy: profile?.fullName,
                createdAt: Date.now(),
                response: tranformedData,
            });
            await markStepCompleted(template.step);

            useToast({
                title: "Reporte guardado exitosamente",
                type: "success",
                duration: 5000,
                position: 'top-right',
                message: `El reporte ha sido guardado correctamente. ${profile?.fullName}`,
            });
            setPendingData(null);
            if (nextUrl) {
                navigate({ to: nextUrl, replace: true });
            } else {
                useToast({
                    title: "¡Proceso Completado!",
                    type: "success",
                    message: "Has finalizado todos los formularios requeridos.",
                });
                navigate({ to: '/formStatus/success', replace: true });
            }
        } catch (error: unknown) {
            useToast({
                title: "Error",
                type: "error",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    };

    // 3. EARLY RETURNS
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

    // 4. MAIN RENDER
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
                onSubmit={handleFormSubmitRequest}
            />

            <AlertDialogCustom
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                message="Confirmar envío"
                description={`Estás a punto de enviar el formulario para el registro de Becas. Revisa que los datos sean correctos antes de continuar.`}
                actionLabel="Enviar Reporte"
                cancelLabel="Revisar de nuevo"
                onConfirm={() => {
                    setIsDialogOpen(false);
                    executeSubmit();
                }}
                onCancel={() => {
                    setIsDialogOpen(false);
                    setPendingData(null);
                }}
            />
        </div>
    );
}