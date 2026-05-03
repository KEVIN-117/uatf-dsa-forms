import { DynamicForm } from "#/shared/components/DynamicForm";
import { notFound } from '@tanstack/react-router';
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { DataTable } from "#/shared/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "#/shared/ui/button";
import { SaveAll, User } from "lucide-react";
import { useTeacherBulkSubmission } from "./hooks/useTeacherBulkSubmission";
import { PageHeader } from "#/shared/components/PageHeader";

interface TeacherReportProps {
    formId: string;
}

export function TeacherReport({ formId }: TeacherReportProps) {
    const { template, isPending, isError, error } = useFormTemplateByModuleAndId('teacher', formId);

    const baseColumns: ColumnDef<Record<string, unknown>, any>[] = [
        {
            accessorKey: 'submittedBy',
            header: 'Registrado por',
            cell: (info) => <span className="font-medium text-primary">{info.getValue()}</span>,
        },
        {
            accessorKey: 'createdAt',
            header: 'Fecha de Registro',
            cell: (info) => new Date(info.getValue()).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }),
        },
    ];

    const { columns, teachers, handleAddTeacherToMemory, executeSubmitBulk, isDialogOpen, setIsDialogOpen } = useTeacherBulkSubmission(formId, baseColumns, template);

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
        <div className="w-full max-w-7xl mx-auto py-2 space-y-4">
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
                <CardHeader>
                    <CardTitle className="text-lg">Añadir Docente</CardTitle>
                </CardHeader>
                <CardContent>
                    <DynamicForm
                        template={template}
                        onSubmit={handleAddTeacherToMemory}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        submitLabel="Agregar a la lista"
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
        </div>
    );
}