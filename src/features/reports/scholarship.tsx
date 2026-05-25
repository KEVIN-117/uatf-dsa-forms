import { DynamicForm } from "#/shared/components/DynamicForm";
import { notFound } from '@tanstack/react-router';
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { useReportSubmission } from "./hooks/useReportSubmission";
import { PageHeader } from "#/shared/components/PageHeader";
import { DollarSignIcon, SaveAll } from "lucide-react";
import { useBulkSubmission } from "./hooks/useBulkSubmission";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { DataTable } from "#/shared/ui/data-table";
import { Button } from "#/shared/ui/button";
import { useOnEditTableActions } from "./BaseColumns";

import type { FormModules } from "#/shared/types/dynamic-form";
import { ResponsesPanel } from "../dashboard/screens/ResponsesPanel";


interface ScholarshipReportProps {
    formId: string;
}

export function ScholarshipReport({ formId }: ScholarshipReportProps) {
    // 1. HOOK ZONE
    const { template, isPending, isError, error } = useFormTemplateByModuleAndId('scholarships', formId);
    const { handleFormSubmitRequest, cancelSubmit, confirmSubmit, initialData, editingId, handleDelete, handleEdit, handleCancelEdit, isDialogOpen: isConfirmDialogOpen, setIsDialogOpen: setIsConfirmDialogOpen, resetForm: resetResponseForm, setResetForm: setResetResponseForm } = useReportSubmission(formId, template);
    const { actionColumns, editDataRef, removeDataRef } = useOnEditTableActions();

    const { columns, data, handleAddDataToMemory, executeSubmitBulk, isDialogOpen: dialogBulkState, setIsDialogOpen: setIsDialogBulkState, resetForm: resetBulkForm, setResetForm: setResetBulkForm, removeData, editData, cancelEdit, editingIndex, initialValues } = useBulkSubmission(formId, actionColumns, template);



    editDataRef.current = editData;
    removeDataRef.current = removeData;

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
                    icon={DollarSignIcon}
                    title={`Formulario: ${template.title}`}
                    description="Completa los campos requeridos para enviar el reporte."
                />

                <DynamicForm
                    key={editingId ? `response-edit-schol-${editingId}` : `bulk-schol-${editingIndex ?? 'new'}`}
                    template={template!}
                    onSubmit={editingId ? handleFormSubmitRequest : handleAddDataToMemory}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    submitLabel={editingId ? "Guardar Cambios" : editingIndex !== null ? "Actualizar registro" : "Agregar a la lista"}
                    resetForm={editingId ? resetResponseForm : resetBulkForm}
                    setResetForm={editingId ? setResetResponseForm : setResetBulkForm}
                    initialValues={editingId ? initialData : initialValues}
                    editMode={editingId
                        ? { type: 'single', onCancel: handleCancelEdit }
                        : editingIndex !== null
                            ? { type: 'bulk', index: editingIndex, onCancel: cancelEdit }
                            : { type: 'none' }
                    }
                />

                <div className="grid grid-cols-1 gap-8">

                    <div className="flex flex-col gap-4">
                        <Card className="shadow-sm border-border flex-1">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Becarios por registrar ({data.length})</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6">
                                {data.length === 0 ? (
                                    <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                                        No hay becarios en la lista. Llena el formulario para comenzar.
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
                                Finalizar y Enviar ({data.length}) Becarios
                            </Button>
                        </div>
                    </div>
                </div>

                <AlertDialogCustom
                    open={dialogBulkState}
                    onOpenChange={setIsDialogBulkState}
                    message="Confirmar envío"
                    description={`Estás a punto de enviar el formulario para el registro de Becas. Revisa que los datos sean correctos antes de continuar.`}
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
                    open={isConfirmDialogOpen}
                    onOpenChange={setIsConfirmDialogOpen}
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
                icon={DollarSignIcon}
                title={`Formulario: ${template.title}`}
                description="Completa los campos requeridos para enviar el reporte."
            />

            <DynamicForm
                key={`edit-schol-${editingId ?? 'new'}`}
                template={template!}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleFormSubmitRequest}
                resetForm={resetResponseForm}
                setResetForm={setResetResponseForm}
                initialValues={initialData}
                editMode={editingId
                    ? { type: 'single', onCancel: handleCancelEdit }
                    : { type: 'none' }
                }
                submitLabel={editingId ? "Guardar Cambios" : "Enviar Reporte"}
            />

            <AlertDialogCustom
                open={isConfirmDialogOpen}
                onOpenChange={setIsConfirmDialogOpen}
                message="Confirmar envío"
                description={`Estás a punto de enviar el formulario para el registro de Becarios. Revisa que los datos sean correctos antes de continuar.`}
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