import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2, Plus } from "lucide-react"

import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute"
import {
    useFaculties,
    useAddFaculty,
    useUpdateFaculty,
    useDeleteFaculty,
} from "#/features/reference-data/hooks/useFaculties"
import type { Faculty } from "#/shared/types"
import { DataTable } from "#/shared/ui/data-table"
import { EntityFormSheet } from "#/shared/ui/entity-form-sheet"
import { Button } from "#/shared/ui/button"
import { Input } from "#/shared/ui/input"
import { Label } from "#/shared/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card"
import { useToast } from "#/shared/components/Toast"

type FacultyFormData = Omit<Faculty, "docId">

const emptyForm: FacultyFormData = { id: "", name: "", code: "" }

export function FacultiesCrud() {
    // 1. HOOK ZONE
    const { isLoading: authLoading, isAuthenticated } = useProtectedRoute()
    const { data: faculties = [], isLoading } = useFaculties()
    const addMutation = useAddFaculty()
    const updateMutation = useUpdateFaculty()
    const deleteMutation = useDeleteFaculty()

    const [sheetOpen, setSheetOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<Faculty | null>(null)
    const [form, setForm] = useState<FacultyFormData>(emptyForm)

    // 2. FUNCTIONS AND LOGIC
    const openCreateSheet = () => {
        setEditingItem(null)
        setForm(emptyForm)
        setSheetOpen(true)
    }

    const openEditSheet = (item: Faculty) => {
        setEditingItem(item)
        setForm({ id: item.id, name: item.name, code: item.code })
        setSheetOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingItem) {
                await updateMutation.mutateAsync({ ...form, docId: editingItem.docId })
                useToast({
                    title: "Facultad actualizada correctamente",
                    type: "success",
                    duration: 5000,
                    closeButton: true,
                    position: 'top-right',
                    message: "La facultad ha sido actualizada correctamente.",
                });
            } else {
                await addMutation.mutateAsync(form)
                useToast({
                    title: "Facultad creada correctamente",
                    type: "success",
                    duration: 5000,
                    closeButton: true,
                    position: 'top-right',
                    message: "La facultad ha sido creada correctamente.",
                });
            }
            setSheetOpen(false)
            setForm(emptyForm)
        } catch (error: unknown) {
            useToast({
                title: "Error",
                type: "error",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    const handleDelete = async (item: Faculty) => {
        if (!confirm(`¿Estás seguro de eliminar la facultad "${item.name}"?`)) return
        try {
            await deleteMutation.mutateAsync(item.docId)
            useToast({
                title: "Facultad eliminada correctamente",
                type: "success",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: "La facultad ha sido eliminada correctamente.",
            });
        } catch (error: unknown) {
            useToast({
                title: "Error",
                type: "error",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: error instanceof Error ? error.message : "Error desconocido",
            });
        }
    }

    const columns: ColumnDef<Faculty>[] = [
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
                        <CardTitle className="text-2xl font-display">Facultades</CardTitle>
                        <CardDescription>Gestiona las facultades de la universidad</CardDescription>
                    </div>
                    <Button onClick={openCreateSheet} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar Facultad
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">Cargando...</div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={faculties}
                            searchPlaceholder="Buscar facultades..."
                            showColumnToggle
                        />
                    )}
                </CardContent>
            </Card>

            <EntityFormSheet
                title={editingItem ? "Editar Facultad" : "Nueva Facultad"}
                description={editingItem ? "Modifica los datos de la facultad" : "Ingresa los datos de la nueva facultad"}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fac-id">ID</Label>
                        <Input
                            id="fac-id"
                            value={form.id}
                            onChange={(e) => setForm({ ...form, id: e.target.value })}
                            placeholder="Ej: A"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fac-name">Nombre</Label>
                        <Input
                            id="fac-name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Ej: FACULTAD DE ARTES"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fac-code">Código</Label>
                        <Input
                            id="fac-code"
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                            placeholder="Ej: FAC. DE ARTES"
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
