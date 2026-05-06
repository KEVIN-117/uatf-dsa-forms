import { DynamicForm } from "#/shared/components/DynamicForm";
import { notFound } from '@tanstack/react-router';
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { PageHeader } from "#/shared/components/PageHeader";

import { SaveAll, User } from "lucide-react";
import { useProgramModalities } from "../reference-data/hooks/useProgramModalities";
import { useAuth } from "../auth/providers/AuthProvider";
import { useCallback, useMemo, useRef } from "react";
import type { FormTemplateDef } from "#/shared/types/dynamic-form";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { Button } from "#/shared/ui/button";
import { DataTable } from "#/shared/ui/data-table";
import { useReportSubmission } from "./hooks/useReportSubmission";
import { useBulkSubmission } from "./hooks/useBulkSubmission";
import { createBaseColumns } from "./BaseColumns";
import { useSubmittedModalities, useSubmittedResponseLimits } from "./hooks/useSubmittedModalidades";


interface StudentReportProps {
    formId: string;
}

export function StudentReport({ formId }: StudentReportProps) {
    // 1. HOOK ZONE
    const { template, isPending, isError, error } = useFormTemplateByModuleAndId('student', formId);
    const { programId } = useAuth()
    const { data: allowedModalities } = useProgramModalities(programId ?? "");

    // Para formularios con step > 1, obtener las modalidades registradas en el formulario anterior (step - 1)
    const previousTemplateId = template ? String(Number(template.id) - 1) : "";
    const { data: submittedModalities } = useSubmittedModalities(
        previousTemplateId,
        "student",
    );
    const { data: modalityLimits } = useSubmittedResponseLimits(
        previousTemplateId,
        "student",
    );

    const editDataRef = useRef<(index: number) => void>(() => { });
    const removeDataRef = useRef<(index: number) => void>(() => { });

    const { handleFormSubmitRequest, isDialogOpen, setIsDialogOpen, confirmSubmit, cancelSubmit, resetForm, setResetForm } = useReportSubmission(formId, template);
    const stableOnEdit = useCallback((i: number) => editDataRef.current(i), []);
    const stableOnDelete = useCallback((i: number) => removeDataRef.current(i), []);

    const actionColumns = useMemo(
        () => createBaseColumns({ onEdit: stableOnEdit, onDelete: stableOnDelete }),
        [stableOnEdit, stableOnDelete],
    );

    const { columns, data, handleAddDataToMemory, executeSubmitBulk, isDialogOpen: dialogStudentState, setIsDialogOpen: setIsDialogStudentState, resetForm: resetBulkForm, setResetForm: setResetBulkForm, removeData, editData, cancelEdit, editingIndex, initialValues } = useBulkSubmission(formId, actionColumns, template);

    editDataRef.current = editData;
    removeDataRef.current = removeData;

    const filteredTemplate = useMemo(() => {
        if (!template) return;

        // Para formularios con step > 1, filtrar modalidades por las que se registraron
        // en el formulario anterior. Para step 1, filtrar por las modalidades permitidas del programa.
        const isFollowUpForm = template.step > 1;
        const modalityFilter = isFollowUpForm ? submittedModalities : allowedModalities;

        if (!modalityFilter || modalityFilter.length === 0) return template;

        return {
            ...template,
            fields: template.fields.map(field => {
                const isModalityField = field.type === "select" && (field.name === 'modalidad' || field.label.toLocaleLowerCase().includes('modalidad'))

                if (isModalityField && field.options) {
                    return {
                        ...field,
                        options: isFollowUpForm
                            // Para follow-up: filtrar por label (que es lo que se guarda en response.modalidad)
                            ? field.options.filter(opt => modalityFilter.includes(String(opt.label)))
                            // Para step 1: filtrar por value (ID de modalidad del programa)
                            : field.options.filter(opt => modalityFilter.includes(String(opt.value)))
                    };
                }
                return field;
            })
        } as FormTemplateDef;

    }, [template, allowedModalities, submittedModalities])

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

    if (template.hasBulk) {
        return (
            <div className="w-full max-w-6xl mx-auto space-y-6">
                <div className="mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/60">
                        Módulo: {template.module.replace('_', ' ')}
                    </span>
                    <h1 className="text-3xl font-display font-bold mt-2">Gestión de Reportes</h1>
                </div>

                <PageHeader
                    icon={User}
                    title={`Formulario: ${template.title}`}
                    description="Completa los campos requeridos para enviar el reporte."
                />

                <DynamicForm
                    template={filteredTemplate!}
                    onSubmit={handleAddDataToMemory}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    submitLabel={editingIndex !== null ? "Actualizar registro" : "Agregar a la lista"}
                    resetForm={resetBulkForm}
                    setResetForm={setResetBulkForm}
                    initialValues={initialValues}
                    editingIndex={editingIndex}
                    cancelEdit={cancelEdit}
                    modalityLimits={template.step > 1 ? modalityLimits : undefined}
                />

                <div className="grid grid-cols-1 gap-8">

                    <div className="flex flex-col gap-4">
                        <Card className="shadow-sm border-border flex-1">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Estudiantes por registrar ({data.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                {data.length === 0 ? (
                                    <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                                        No hay estudiantes en la lista. Llena el formulario para comenzar.
                                    </div>
                                ) : (
                                    <DataTable<Record<string, unknown>, unknown>
                                        columns={columns}
                                        data={data}
                                        showColumnToggle
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button
                                size="lg"
                                disabled={data.length === 0}
                                onClick={() => setIsDialogStudentState(true)}
                                className="w-full sm:w-auto font-bold"
                            >
                                <SaveAll className="mr-2 size-5" />
                                Finalizar y Enviar ({data.length}) Estudiantes
                            </Button>
                        </div>
                    </div>
                </div>

                <AlertDialogCustom
                    open={dialogStudentState}
                    onOpenChange={setIsDialogStudentState}
                    message="Confirmar envío"
                    description={`Estás a punto de enviar el formulario para el registro de Estudiantes. Revisa que los datos sean correctos antes de continuar.`}
                    actionLabel="Enviar Reporte"
                    cancelLabel="Revisar de nuevo"
                    onConfirm={() => {
                        setIsDialogStudentState(false);
                        executeSubmitBulk();
                    }}
                    onCancel={() => {
                        setIsDialogStudentState(false);
                    }}
                />
            </div>
        )
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
                icon={User}
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
                description={`Estás a punto de enviar el formulario para el registro de Estudiantes. Revisa que los datos sean correctos antes de continuar.`}
                actionLabel="Enviar Reporte"
                cancelLabel="Revisar de nuevo"
                onConfirm={confirmSubmit}
                onCancel={cancelSubmit}
            />
        </div>
    );
}