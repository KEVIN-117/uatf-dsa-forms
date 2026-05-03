import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { FileSpreadsheet, BarChart3 } from 'lucide-react';
import { DataTable } from '#/shared/ui/data-table';

import { useFormTemplateById } from '#/shared/hooks/useFormBuilder';
import { useGetResponses } from '#/shared/hooks/useFormResponses';
import { useProtectedRoute } from '#/features/auth/hooks/useProtectedRoute';

import { Card, CardContent } from '#/shared/ui/card';
import { Button } from '#/shared/ui/button';
import { Badge } from '#/shared/ui/badge';
import type { FormModules, FormResponseDef } from '#/shared/types/dynamic-form';
import { PageHeader } from '#/shared/components/PageHeader';
import { InlineLoader } from '#/shared/components/InlineLoader';
import { Loader } from '#/shared/components/Loader';

interface ResponsePanelProps {
    formId: string;
    module: string;
}

export function ResponsesPanel({ formId, module }: ResponsePanelProps) {
    // 1. HOOK ZONE
    const { isAuthenticated } = useProtectedRoute();
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

    // 2. EARLY RETURNS
    if (!isAuthenticated || !template) {
        return <Loader text="Cargando resultados..." />;
    }

    // 3. MAIN RENDER
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between animate-fade-up">
                <PageHeader
                    icon={BarChart3}
                    title={`Resultados: ${template.title}`}
                    description={`Módulo: ${template.module.toUpperCase()} • Total registros: ${responses.length}`}
                />
            </div>

            <div className="flex items-center gap-3 animate-fade-up-delay-1">
                <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30 bg-primary/5 text-primary">
                    {template.module.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-xs px-3 py-1 border-border/50 text-muted-foreground">
                    {responses.length} registros
                </Badge>
                <div className="flex-1" />
                <Button variant="outline" className="font-semibold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                    <FileSpreadsheet className="size-4 mr-2" />
                    Exportar a Excel
                </Button>
            </div>

            <Card className="glass-card overflow-hidden animate-fade-up-delay-2">
                <CardContent className="p-0">
                    {isLoadingResponses ? (
                        <InlineLoader text="Cargando registros..." />
                    ) : (
                        <DataTable columns={columns} data={responses} showColumnToggle />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}