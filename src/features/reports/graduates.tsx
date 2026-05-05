import { DynamicForm } from "#/shared/components/DynamicForm";
import { notFound } from '@tanstack/react-router';
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { useReportSubmission } from "./hooks/useReportSubmission";
import { GraduationCap } from "lucide-react";
import { PageHeader } from "#/shared/components/PageHeader";
import { useProgramGraduationModalities } from "../reference-data/hooks/useProgramModalities";
import { useAuth } from "../auth/providers/AuthProvider";
import { useMemo } from "react";
import type { FormTemplateDef } from "#/shared/types/dynamic-form";

interface GraduatesReportProps {
    formId: string;
}

export function GraduatesReport({ formId }: GraduatesReportProps) {
    // 1. HOOK ZONE
    const { template, isPending, isError, error } = useFormTemplateByModuleAndId('graduate', formId);
    const { programId } = useAuth()
    const { handleFormSubmitRequest, isDialogOpen, setIsDialogOpen, confirmSubmit, cancelSubmit, resetForm, setResetForm } = useReportSubmission(formId, template);
    const { data: allowedGraduationModalities } = useProgramGraduationModalities(programId ?? "");

    const filteredTemplate = useMemo(() => {
        if (!template) return;

        if (!allowedGraduationModalities || allowedGraduationModalities.length === 0) return template;

        return {
            ...template,
            fields: template.fields.map((field) => {
                const isGraduationModalityField = field.type === "select" && (field.name === "modalidad" || field.label.toLocaleLowerCase().includes("modalidad"))

                if (isGraduationModalityField && field.options) {
                    return {
                        ...field,
                        options: field.options.filter((option) => allowedGraduationModalities.includes(String(option.value)))
                    }
                }
                return field;
            })
        } as FormTemplateDef
    }, [template, allowedGraduationModalities])

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
        <div className="w-full max-w-6xl mx-auto py-10">
            <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-primary/60">
                    Módulo: {template.module.replace('_', ' ')}
                </span>
                <h1 className="text-3xl font-display font-bold mt-2">Gestión de Reportes</h1>
            </div>
            <PageHeader
                icon={GraduationCap}
                title={`Formulario: ${template.title}`}
                description="Completa los campos requeridos para enviar el reporte."
            />
            <DynamicForm
                template={filteredTemplate!}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleFormSubmitRequest}
                resetForm={resetForm}
                setResetForm={setResetForm}
            />
            <AlertDialogCustom
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                message="Confirmar envío"
                description={`Estás a punto de enviar el formulario para el registro de Egresados. Revisa que los datos sean correctos antes de continuar.`}
                actionLabel="Enviar Reporte"
                cancelLabel="Revisar de nuevo"
                onConfirm={() => {
                    confirmSubmit();
                }}
                onCancel={() => {
                    cancelSubmit();
                }}
            />
        </div>
    );
}