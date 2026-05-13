import { DynamicForm } from "#/shared/components/DynamicForm";
import { notFound } from '@tanstack/react-router';
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { useReportSubmission } from "./hooks/useReportSubmission";
import { GraduationCap, SaveAll } from "lucide-react";
import { PageHeader } from "#/shared/components/PageHeader";
import { useProgramGraduationModalities } from "../reference-data/hooks/useProgramModalities";
import { useAuth } from "../auth/providers/AuthProvider";
import { useEffect, useMemo } from "react";
import type { FormModules, FormTemplateDef } from "#/shared/types/dynamic-form";
import { useBulkSubmission } from "./hooks/useBulkSubmission";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { DataTable } from "#/shared/ui/data-table";
import { Button } from "#/shared/ui/button";
import { useOnEditTableActions } from "./BaseColumns";
import { ResponsesPanel } from "../dashboard/screens/ResponsesPanel";

interface GraduatesReportProps {
    formId: string;
}

export function GraduatesReport({ formId }: GraduatesReportProps) {
    // 1. HOOK ZONE
    const { template, isPending, isError, error } = useFormTemplateByModuleAndId('graduate', formId);
    const { programId } = useAuth()

    const { actionColumns, editDataRef, removeDataRef } = useOnEditTableActions();

    const { handleFormSubmitRequest, isDialogOpen, setIsDialogOpen, confirmSubmit, cancelSubmit, resetForm: resetResponseForm, setResetForm: setResetResponseForm, initialData, editingId, handleDelete, handleEdit, handleCancelEdit, setScrollToTop, scrollToTop } = useReportSubmission(formId, template);
    const { columns, data, handleAddDataToMemory, executeSubmitBulk, isDialogOpen: dialogBulkState, setIsDialogOpen: setIsDialogBulkState, resetForm: resetBulkForm, setResetForm: setResetBulkForm, removeData, editData, cancelEdit, editingIndex, initialValues } = useBulkSubmission(formId, actionColumns, template);

    editDataRef.current = editData;
    removeDataRef.current = removeData;
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

    useEffect(() => {
        if (scrollToTop && editingId) {
            const element = document.getElementById("page-top");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            setScrollToTop(false);
        }
    }, [scrollToTop, editingId, setScrollToTop]);

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
            <div className="w-full max-w-6xl mx-auto py-10" id="page-top">
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
                    key={editingId ? `response-edit-${editingId}` : `bulk-${editingIndex ?? 'new'}`}
                    template={filteredTemplate!}
                    onSubmit={editingId ? handleFormSubmitRequest : handleAddDataToMemory}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    submitLabel={editingId ? "Guardar Cambios" : editingIndex !== null ? "Actualizar registro" : "Agregar a la lista"}
                    resetForm={editingId ? resetResponseForm : resetBulkForm}
                    setResetForm={editingId ? setResetResponseForm : setResetBulkForm}
                    initialValues={editingId ? initialData : initialValues}
                    editingIndex={editingId ? null : editingIndex}
                    cancelEdit={editingId ? undefined : cancelEdit}
                    isEditing={!!editingId}
                    onCancelEdit={editingId ? handleCancelEdit : undefined}
                />

                <div className="grid grid-cols-1 gap-8">

                    <div className="flex flex-col gap-4">
                        <Card className="shadow-sm border-border flex-1">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Egresados por registrar ({data.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                {data.length === 0 ? (
                                    <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                                        No hay egresados en la lista. Llena el formulario para comenzar.
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
                                onClick={() => setIsDialogBulkState(true)}
                                className="w-full sm:w-auto font-bold"
                            >
                                <SaveAll className="mr-2 size-5" />
                                Finalizar y Enviar ({data.length}) Egresados
                            </Button>
                        </div>
                    </div>
                </div>

                <AlertDialogCustom
                    open={dialogBulkState}
                    onOpenChange={setIsDialogBulkState}
                    message="Confirmar envío"
                    description={`Estás a punto de enviar el formulario para el registro de Egresados. Revisa que los datos sean correctos antes de continuar.`}
                    actionLabel="Enviar Reporte"
                    cancelLabel="Revisar de nuevo"
                    onConfirm={() => {
                        setIsDialogBulkState(false);
                        executeSubmitBulk();
                    }}
                    onCancel={() => {
                        setIsDialogBulkState(false);
                    }}
                />

                <AlertDialogCustom
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    message="Confirmar actualización"
                    description="Estás a punto de actualizar este registro. Revisa que los datos sean correctos antes de continuar."
                    actionLabel="Guardar Cambios"
                    cancelLabel="Revisar de nuevo"
                    onConfirm={confirmSubmit}
                    onCancel={cancelSubmit}
                />

                <ResponsesPanel
                    formId={formId}
                    module={template?.module as FormModules}
                    variant='embedded'
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            </div>
        )
    }

    // 4. MAIN RENDER (non-bulk)
    return (
        <div className="w-full max-w-6xl mx-auto py-10" id="page-top">
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
                key={`edit-${editingId ?? 'new'}`}
                template={filteredTemplate!}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleFormSubmitRequest}
                resetForm={resetResponseForm}
                setResetForm={setResetResponseForm}
                initialValues={initialData}
                isEditing={!!editingId}
                submitLabel={editingId ? "Guardar Cambios" : "Enviar Reporte"}
                onCancelEdit={handleCancelEdit}
            />

            <AlertDialogCustom
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                message="Confirmar envío"
                description={`Estás a punto de enviar el formulario para el registro de Egresados. Revisa que los datos sean correctos antes de continuar.`}
                actionLabel="Enviar Reporte"
                cancelLabel="Revisar de nuevo"
                onConfirm={confirmSubmit}
                onCancel={cancelSubmit}
            />

            <ResponsesPanel
                formId={formId}
                module={template?.module as FormModules}
                variant='embedded'
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
}