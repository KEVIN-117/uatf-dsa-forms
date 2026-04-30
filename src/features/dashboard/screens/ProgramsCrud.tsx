import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2, Plus } from "lucide-react"

import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute"
import {
    usePrograms,
    useAddProgram,
    useUpdateProgram,
    useDeleteProgram,
} from "#/features/reference-data/hooks/usePrograms"
import { useFaculties } from "#/features/reference-data/hooks/useFaculties"
import type { Program } from "#/shared/types"
import { DataTable } from "#/shared/ui/data-table"
import { EntityFormSheet } from "#/shared/ui/entity-form-sheet"
import { Button } from "#/shared/ui/button"
import { Input } from "#/shared/ui/input"
import { Label } from "#/shared/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/shared/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card"
import { useToast } from "#/shared/components/Toast"

type ProgramFormData = Omit<Program, "docId">

const emptyForm: ProgramFormData = { id: "", name: "", code: "", facultyId: "", campusId: "1", level: "LIC" }

export function ProgramsCrud() {
    // 1. HOOK ZONE
    const { isLoading: authLoading, isAuthenticated } = useProtectedRoute()
    const { data: programs = [], isLoading } = usePrograms()
    const { data: faculties = [] } = useFaculties()
    const addMutation = useAddProgram()
    const updateMutation = useUpdateProgram()
    const deleteMutation = useDeleteProgram()

    const [sheetOpen, setSheetOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Program | null>(null)
    const [form, setForm] = useState<ProgramFormData>(emptyForm)

    // 2. FUNCTIONS AND LOGIC
    const openCreateSheet = () => {
        setEditingItem(null)
        setForm(emptyForm)
        setSheetOpen(true)
    }

    const openEditSheet = (item: Program) => {
        setEditingItem(item)
        setForm({
            id: item.id,
            name: item.name,
            code: item.code,
            facultyId: item.facultyId,
            campusId: item.campusId,
            level: item.level,
        })
        setSheetOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingItem) {
                await updateMutation.mutateAsync({ ...form, docId: editingItem.docId })
                useToast({
                    title: "Carrera actualizada",
                    type: "success",
                    duration: 5000,
                    closeButton: true,
                    position: 'top-right',
                    message: "Carrera actualizada correctamente.",
                });
            } else {
                await addMutation.mutateAsync(form)
                useToast({
                    title: "Carrera creada",
                    type: "success",
                    duration: 5000,
                    closeButton: true,
                    position: 'top-right',
                    message: "Carrera creada correctamente.",
                });
            }
            setSheetOpen(false)
            setForm(emptyForm)
        } catch (error) {
            useToast({
                title: "Error al guardar",
                type: "error",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: "Error al guardar la carrera.",
            });
        }
    }

    const handleDelete = async (item: Program) => {
        if (!confirm(`¿Estás seguro de eliminar la carrera "${item.name}"?`)) return
        try {
            await deleteMutation.mutateAsync(item.docId)
            useToast({
                title: "Carrera eliminada",
                type: "success",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: "Carrera eliminada correctamente.",
            });
        } catch (error) {
            useToast({
                title: "Error al eliminar",
                type: "error",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: "Error al eliminar la carrera.",
            });
        }
    }

    // Helper para obtener nombre de la facultad
    const getFacultyName = (facultyId: string) => {
        return faculties.find((f) => f.id === facultyId)?.name ?? facultyId
    }

    const columns: ColumnDef<Program>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "name",
            header: "Nombre",
        },
        {
            accessorKey: "code",
            header: "Código",
        },
        {
            accessorKey: "facultyId",
            header: "Facultad",
            cell: ({ row }) => getFacultyName(row.original.facultyId),
        },
        {
            accessorKey: "level",
            header: "Nivel",
        },
        {
            accessorKey: "campusId",
            header: "Campus",
        },
        {
            id: "actions",
            header: "Acciones",
            enableColumnFilter: false,
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditSheet(row.original)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(row.original)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ]

    // 3. EARLY RETURNS
    if (authLoading) {
        return <div className="flex h-full items-center justify-center">Verificando sesión...</div>
    }
    if (!isAuthenticated) return null

    // 4. MAIN RENDER
    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-2xl font-display">Carreras / Programas</CardTitle>
                        <CardDescription>Gestiona las carreras y programas académicos</CardDescription>
                    </div>
                    <Button onClick={openCreateSheet} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar Carrera
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Cargando...</div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={programs}
                            searchPlaceholder="Buscar carreras..."
                            showColumnToggle
                        />
                    )}
                </CardContent>
            </Card>

            <EntityFormSheet
                title={editingItem ? "Editar Carrera" : "Nueva Carrera"}
                description={editingItem ? "Modifica los datos de la carrera" : "Ingresa los datos de la nueva carrera"}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="prog-id">ID</Label>
                        <Input
                            id="prog-id"
                            value={form.id}
                            onChange={(e) => setForm({ ...form, id: e.target.value })}
                            placeholder="Ej: SIS"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prog-name">Nombre</Label>
                        <Input
                            id="prog-name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Ej: INGENIERIA DE SISTEMAS"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prog-code">Código</Label>
                        <Input
                            id="prog-code"
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                            placeholder="Ej: M11"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prog-faculty">Facultad</Label>
                        <Select
                            value={form.facultyId}
                            onValueChange={(value) => setForm({ ...form, facultyId: value })}
                        >
                            <SelectTrigger id="prog-faculty">
                                <SelectValue placeholder="Seleccionar facultad" />
                            </SelectTrigger>
                            <SelectContent>
                                {faculties.map((fac) => (
                                    <SelectItem key={fac.id} value={fac.id}>
                                        {fac.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prog-level">Nivel</Label>
                        <Select
                            value={form.level}
                            onValueChange={(value) => setForm({ ...form, level: value })}
                        >
                            <SelectTrigger id="prog-level">
                                <SelectValue placeholder="Seleccionar nivel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LIC">Licenciatura (LIC)</SelectItem>
                                <SelectItem value="TUS">Técnico Universitario Superior (TUS)</SelectItem>
                                <SelectItem value="TUM">Técnico Universitario Medio (TUM)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="prog-campus">Campus ID</Label>
                        <Input
                            id="prog-campus"
                            value={form.campusId}
                            onChange={(e) => setForm({ ...form, campusId: e.target.value })}
                            placeholder="Ej: 1"
                            required
                        />
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1" disabled={addMutation.isPending || updateMutation.isPending}>
                            {(addMutation.isPending || updateMutation.isPending) ? "Guardando..." : editingItem ? "Actualizar" : "Crear"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </EntityFormSheet>
        </div>
    )
}
