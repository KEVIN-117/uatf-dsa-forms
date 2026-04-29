import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { DataTable } from '#/shared/ui/data-table';

import { useFormTemplateById } from '#/shared/hooks/useFormBuilder';
import { useGetResponses } from '#/shared/hooks/useFormResponses';
import { useProtectedRoute } from '#/features/auth/hooks/useProtectedRoute';

import { Card, CardContent } from '#/shared/ui/card';
import { Button } from '#/shared/ui/button';
import type { FormModules, FormResponseDef } from '#/shared/types/dynamic-form';

interface ResponsePanelProps {
    formId: string;
    module: string;
}

export function ResponsesPanel({ formId, module }: ResponsePanelProps) {
    const { isAuthenticated } = useProtectedRoute();

    // formId IS the templateId — look it up directly from the templates cache
    const { template } = useFormTemplateById(formId);

    const { data: responses = [], isLoading: isLoadingResponses } = useGetResponses(
        module as FormModules,
        formId
    );
    const columns = useMemo<ColumnDef<FormResponseDef, any>[]>(() => {
        if (!template) return [];

        // Columnas base (siempre existen)
        const baseColumns: ColumnDef<FormResponseDef, any>[] = [
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

        // Columnas dinámicas (basadas en los campos del JSON de la plantilla)
        const dynamicColumns: ColumnDef<FormResponseDef, any>[] = template.fields.map((field) => ({
            // Buscamos el valor dentro del objeto 'response' usando el name del campo
            accessorFn: (row: any) => row.response?.[field.name],
            id: field.id,
            header: field.label, // El título de la columna es el Label del campo
            cell: (info) => {
                const val = info.getValue();
                // Si el campo es un booleano (switch), mostramos algo legible
                if (typeof val === 'boolean') return val ? 'Sí' : 'No';
                return val || '-';
            },
        }));

        return [...baseColumns, ...dynamicColumns];
    }, [template]);


    if (!isAuthenticated || !template) return <div className="p-8"><Loader2 className="animate-spin text-primary mx-auto" /></div>;

    return (
        <div className="container mx-auto py-8 font-body space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Resultados: {template.title}</h1>
                    <p className="text-muted-foreground uppercase text-sm tracking-wider mt-1">
                        Módulo: {template.module} | Total registros: {responses.length}
                    </p>
                </div>
                <Button variant="outline" className="font-semibold text-primary border-primary/20 bg-primary/5">
                    <FileSpreadsheet className="size-4 mr-2" />
                    Exportar a Excel
                </Button>
            </div>

            <Card className="shadow-md border-border">
                <CardContent className="p-4 sm:p-6">
                    {isLoadingResponses ? (
                        <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
                    ) : (
                        <DataTable columns={columns} data={responses} showColumnToggle />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}