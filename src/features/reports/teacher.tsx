import { DynamicForm } from "#/shared/components/DynamicForm";
import { notFound } from '@tanstack/react-router';
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import { useSubmitFormResponse } from "#/shared/hooks/useFormResponses";
import type { FormModules } from "#/shared/types/dynamic-form";
import { useDirectorProfile } from "../director-profile/providers/DirectorProfileProvider";
import { useState } from "react";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { useToast } from "#/shared/components/Toast";

interface TeacherReportProps {
    formId: string;
}

export function TeacherReport({ formId }: TeacherReportProps) {
    const { template, isPending, isError, error } = useFormTemplateByModuleAndId('teacher', formId);

    const { mutateAsync } = useSubmitFormResponse();
    const { profile } = useDirectorProfile();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pendingData, setPendingData] = useState<{ data: Record<string, unknown>, module: string } | null>(null);

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

            useToast({
                title: "Reporte guardado exitosamente",
                type: "success",
                duration: 5000,
                position: 'top-right',
                message: `El reporte ha sido guardado correctamente. ${profile?.fullName}`,
            });
            setPendingData(null);
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
                onSubmit={handleFormSubmitRequest}
            />

            <AlertDialogCustom
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                message="Confirmar envío"
                description={`Estás a punto de enviar el formulario para el registro de Docentes. Revisa que los datos sean correctos antes de continuar.`}
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