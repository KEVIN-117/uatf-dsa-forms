import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { FileSpreadsheet, BarChart3, Pencil, Trash2 } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/shared/ui/select';
import { useAuth } from '#/features/auth/providers/AuthProvider';

interface ResponsePanelProps {
    formId: string;
    module: FormModules;
    variant?: 'page' | 'embedded';
    onEdit?: (response: FormResponseDef) => void;
    onDelete?: (id: string) => void;
}

export function ResponsesPanel({ formId, module, variant = 'page', onDelete, onEdit }: ResponsePanelProps) {
    // 1. HOOK ZONE
    const { isAuthenticated } = useProtectedRoute();
    const { userRole } = useAuth();
    const { template } = useFormTemplateById(formId);
    const { data: responses = [], isLoading: isLoadingResponses } = useGetResponses(
        module,
        formId
    );
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>("all");
    const [selectedProgramId, setSelectedProgramId] = useState<string>("all");

    const facultyOptions = useMemo(() => {
        const map = new Map<string, string>();
        responses.forEach((r) => {
            if (r.facultyId) map.set(r.facultyId, r.faculty || r.facultyId);
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
    }, [responses]);

    const programOptions = useMemo(() => {
        const map = new Map<string, string>();
        responses.forEach((r) => {
            if (selectedFacultyId !== "all" && r.facultyId !== selectedFacultyId) return;
            if (r.programId) map.set(r.programId, r.program || r.programId);
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
    }, [responses, selectedFacultyId]);

    useEffect(() => {
        if (selectedProgramId === "all") return;
        const existsInCurrentFaculty = programOptions.some((p) => p.id === selectedProgramId);
        if (!existsInCurrentFaculty) {
            setSelectedProgramId("all");
        }
    }, [programOptions, selectedProgramId]);

    const filteredResponses = useMemo(() => {
        return responses.filter((r) => {
            const byFaculty = selectedFacultyId === "all" || r.facultyId === selectedFacultyId;
            const byProgram = selectedProgramId === "all" || r.programId === selectedProgramId;
            return byFaculty && byProgram;
        });
    }, [responses, selectedFacultyId, selectedProgramId]);

    const columns = useMemo<ColumnDef<FormResponseDef, any>[]>(() => {
        if (!template) return [];

        const isAdmin = userRole === "administrator";
        const isDirector = userRole === "director";

        // Columnas base de metadata (solo para admin)
        const baseColumns: ColumnDef<FormResponseDef, any>[] = isAdmin ? [
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
        ] : [];

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

        const finalColumns = [...baseColumns, ...dynamicColumns];

        // Columna de acciones según el rol:
        // - Director: solo editar (onEdit)
        // - Admin: editar (onEdit) y eliminar (onDelete)
        const canEdit = onEdit && (isAdmin || isDirector);
        const canDelete = onDelete && isAdmin;

        if (canEdit || canDelete) {
            finalColumns.push({
                id: "actions",
                header: "Acciones",
                cell: ({ row }) => (
                    <div className="flex items-center gap-1">
                        {canEdit && (
                            <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)} className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                <Pencil className="h-4 w-4" />
                            </Button>
                        )}
                        {canDelete && (
                            <Button variant="ghost" size="icon" onClick={() => onDelete(row.original.id)} className="h-8 w-8 hover:bg-destructive/10 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )
            });
        }

        return finalColumns;
    }, [template, onEdit, onDelete, userRole]);
    const isEmbedded = variant === 'embedded';

    // 2. EARLY RETURNS
    if (!isAuthenticated || !template) {
        return <Loader text="Cargando resultados..." />;
    }

    // 3. MAIN RENDER
    return (
        <div className={isEmbedded ? "space-y-6 mt-16 pt-8 border-t border-border/50" : "p-6 space-y-6 max-w-8xl mx-auto"}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between animate-fade-up">
                {!isEmbedded && (
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between animate-fade-up">
                        <PageHeader
                            icon={BarChart3}
                            title={`Resultados: ${template.title}`}
                            description={`Módulo: ${template.module.toUpperCase()} • Total registros: ${responses.length}`}
                        />
                    </div>
                )}

                {isEmbedded && (
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <BarChart3 className="size-5 text-primary" />
                        Envíos Registrados
                    </h3>
                )}
            </div>

            <div className="flex items-center gap-3 animate-fade-up-delay-1">
                <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30 bg-primary/5 text-primary">
                    {template.module.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-xs px-3 py-1 border-border/50 text-muted-foreground">
                    {responses.length} registros
                </Badge>
                <div className="flex-1" />
                {
                    userRole === "administrator" &&
                    <Button variant="outline" className="font-semibold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                        <FileSpreadsheet className="size-4 mr-2" />
                        Exportar a Excel
                    </Button>
                }
            </div>

            {
                userRole === "administrator" && (
                    <Card className="glass-card animate-fade-up-delay-1">
                        <CardContent className="p-4 grid gap-3 md:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Filtrar por Facultad</p>
                                <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todas las facultades" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-background'>
                                        <SelectItem value="all">Todas las facultades</SelectItem>
                                        {facultyOptions.map((f) => (
                                            <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Filtrar por Carrera</p>
                                <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todas las carreras" />
                                    </SelectTrigger>
                                    <SelectContent className='bg-background'>
                                        <SelectItem value="all">Todas las carreras</SelectItem>
                                        {programOptions.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                )
            }

            <Card className="glass-card overflow-hidden animate-fade-up-delay-2">
                <CardContent className="p-0">
                    {isLoadingResponses ? (
                        <InlineLoader text="Cargando registros..." />
                    ) : (
                        <DataTable columns={columns} data={filteredResponses} showColumnToggle />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
