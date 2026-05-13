import { DynamicForm } from "#/shared/components/DynamicForm";
import { notFound } from '@tanstack/react-router';
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { DataTable } from "#/shared/ui/data-table";
import { Button } from "#/shared/ui/button";
import { SaveAll, User, X } from "lucide-react";
import { PageHeader } from "#/shared/components/PageHeader";
import { useBulkSubmission } from "./hooks/useBulkSubmission";
import { useOnEditTableActions } from "./BaseColumns";
import { useEffect } from "react";
import { useReportSubmission } from "./hooks/useReportSubmission";
import { ResponsesPanel } from "../dashboard/screens/ResponsesPanel";
import type { FormModules } from "#/shared/types/dynamic-form";

interface TeacherReportProps {
    formId: string;
}

export function TeacherReport({ formId }: TeacherReportProps) {
    const { template, isPending, isError, error } = useFormTemplateByModuleAndId('teacher', formId);

    // Use refs to break the circular dependency between useBulkSubmission and createBaseColumns
    const { actionColumns, editDataRef, removeDataRef } = useOnEditTableActions();

    const { handleFormSubmitRequest, cancelSubmit, confirmSubmit, initialData, editingId, handleDelete, handleEdit, handleCancelEdit, isDialogOpen: isConfirmDialogOpen, setIsDialogOpen: setIsConfirmDialogOpen, scrollToTop, setScrollToTop, resetForm: resetResponseForm, setResetForm: setResetResponseForm } = useReportSubmission(formId, template);

    const {
        columns,
        data: teachers,
        handleAddDataToMemory: handleAddTeacherToMemory,
        executeSubmitBulk,
        isDialogOpen,
        setIsDialogOpen,
        resetForm,
        setResetForm,
        removeData,
        editData,
        cancelEdit,
        editingIndex,
        initialValues,
    } = useBulkSubmission(formId, actionColumns, template);

    useEffect(() => {
        if (scrollToTop && editingId) {
            const element = document.getElementById("page-top");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            setScrollToTop(false);
        }
    }, [scrollToTop, editingId, setScrollToTop]);

    // Keep refs in sync with the latest callbacks from the hook
    editDataRef.current = editData;
    removeDataRef.current = removeData;

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
        <div className="w-full max-w-6xl mx-auto py-2 space-y-4" id="page-top">
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

            <Card className="shadow-sm w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                        {editingIndex !== null ? "Actualizar Docente" : "Añadir Docente"}
                    </CardTitle>
                    {editingIndex !== null && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar edición
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <DynamicForm
                        key={editingId ? `response-edit-${editingId}` : `bulk-${editingIndex ?? 'new'}`}
                        template={template!}
                        onSubmit={editingId ? handleFormSubmitRequest : handleAddTeacherToMemory}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        submitLabel={editingId ? "Guardar Cambios" : editingIndex !== null ? "Actualizar registro" : "Agregar a la lista"}
                        resetForm={editingId ? resetResponseForm : resetForm}
                        setResetForm={editingId ? setResetResponseForm : setResetForm}
                        initialValues={editingId ? initialData : initialValues}
                        editingIndex={editingId ? null : editingIndex}
                        cancelEdit={editingId ? undefined : cancelEdit}
                        isEditing={!!editingId}
                        onCancelEdit={editingId ? handleCancelEdit : undefined}
                    />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-8">

                <div className="flex flex-col gap-4">
                    <Card className="shadow-sm border-border flex-1">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Docentes por registrar ({teachers.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6">
                            {teachers.length === 0 ? (
                                <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                                    No hay docentes en la lista. Llena el formulario para comenzar.
                                </div>
                            ) : (
                                <DataTable<Record<string, unknown>, unknown>
                                    columns={columns}
                                    data={teachers}
                                    showColumnToggle
                                />
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            size="lg"
                            disabled={teachers.length === 0}
                            onClick={() => setIsDialogOpen(true)}
                            className="w-full sm:w-auto font-bold"
                        >
                            <SaveAll className="mr-2 size-5" />
                            Finalizar y Enviar ({teachers.length}) Docentes
                        </Button>
                    </div>
                </div>
            </div>

            <AlertDialogCustom
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                message="Confirmar envío"
                description={`Estás a punto de enviar el formulario para el registro de Docentes. Revisa que los datos sean correctos antes de continuar.`}
                actionLabel="Enviar Reporte"
                cancelLabel="Revisar de nuevo"
                onConfirm={() => {
                    setIsDialogOpen(false);
                    executeSubmitBulk();
                }}
                onCancel={() => {
                    setIsDialogOpen(false);
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
    );
}