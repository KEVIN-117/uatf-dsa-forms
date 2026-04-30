import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2, Plus } from "lucide-react"

import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute"
import {
    useModalities,
    useAddModality,
    useUpdateModality,
    useDeleteModality,
} from "#/features/reference-data/hooks/useModalities"
import type { Modality } from "#/shared/types"
import { DataTable } from "#/shared/ui/data-table"
import { EntityFormSheet } from "#/shared/ui/entity-form-sheet"
import { Button } from "#/shared/ui/button"
import { Input } from "#/shared/ui/input"
import { Label } from "#/shared/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card"
import { useToast } from "#/shared/components/Toast"

type ModalityFormData = Omit<Modality, "docId">
const emptyForm: ModalityFormData = { id: "", modality: "", code: "" }

export function ModalitiesCrud() {
    // 1. HOOK ZONE
    const { isLoading: authLoading, isAuthenticated } = useProtectedRoute()
    const { data: modalities = [], isLoading } = useModalities()
    const addMut = useAddModality()
    const updateMut = useUpdateModality()
    const deleteMut = useDeleteModality()

    const [sheetOpen, setSheetOpen] = useState(false)
    const [editing, setEditing] = useState<Modality | null>(null)
    const [form, setForm] = useState<ModalityFormData>(emptyForm)

    // 2. FUNCTIONS AND LOGIC
    const openCreate = () => { setEditing(null); setForm(emptyForm); setSheetOpen(true) }
    const openEdit = (item: Modality) => {
        setEditing(item)
        setForm({ id: item.id, modality: item.modality, code: item.code })
        setSheetOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editing) {
                await updateMut.mutateAsync({ ...form, docId: editing.docId })
                useToast({
                    title: "Modalidad actualizada",
                    type: "success",
                    duration: 5000,
                    closeButton: true,
                    position: 'top-right',
                    message: "Modalidad de graduación actualizada correctamente.",
                });
            } else {
                await addMut.mutateAsync(form)
                useToast({
                    title: "Modalidad creada",
                    type: "success",
                    duration: 5000,
                    closeButton: true,
                    position: 'top-right',
                    message: "Modalidad de graduación creada correctamente.",
                });
            }
            setSheetOpen(false); setForm(emptyForm)
        } catch {
            useToast({
                title: "Error al guardar",
                type: "error",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: "Error al guardar la modalidad.",
            });
        }
    }

    const handleDelete = async (item: Modality) => {
        if (!confirm(`¿Eliminar "${item.modality}"?`)) return
        try {
            await deleteMut.mutateAsync(item.docId);
            useToast({
                title: "Modalidad eliminada",
                type: "success",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: "Modalidad de graduación eliminada correctamente.",
            });
        } catch {
            useToast({
                title: "Error al eliminar",
                type: "error",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: "Error al eliminar la modalidad.",
            });
        }
    }

    const columns: ColumnDef<Modality>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "modality", header: "Nombre" },
        { accessorKey: "code", header: "Código" },
        {
            id: "actions", header: "Acciones", enableColumnFilter: false, enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row.original)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(row.original)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            ),
        },
    ]

    // 3. EARLY RETURNS
    if (authLoading) return <div className="flex h-full items-center justify-center">Verificando sesión...</div>
    if (!isAuthenticated) return null

    // 4. MAIN RENDER
    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-2xl font-display">Modalidades de Ingreso</CardTitle>
                        <CardDescription>Gestiona las modalidades de ingreso a la universidad</CardDescription>
                    </div>
                    <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" />Agregar Modalidad</Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? <div className="text-center py-8 text-muted-foreground">Cargando...</div> : (
                        <DataTable columns={columns} data={modalities} searchPlaceholder="Buscar modalidades..." showColumnToggle />
                    )}
                </CardContent>
            </Card>
            <EntityFormSheet title={editing ? "Editar Modalidad" : "Nueva Modalidad"} description={editing ? "Modifica los datos" : "Ingresa los datos"} open={sheetOpen} onOpenChange={setSheetOpen}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2"><Label htmlFor="mod-id">ID</Label><Input id="mod-id" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="Ej: 1" required /></div>
                    <div className="space-y-2"><Label htmlFor="mod-name">Nombre</Label><Input id="mod-name" value={form.modality} onChange={(e) => setForm({ ...form, modality: e.target.value })} placeholder="Ej: EXAMEN P.S.A." required /></div>
                    <div className="space-y-2"><Label htmlFor="mod-code">Código</Label><Input id="mod-code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Ej: PSA" required /></div>
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1" disabled={addMut.isPending || updateMut.isPending}>{(addMut.isPending || updateMut.isPending) ? "Guardando..." : editing ? "Actualizar" : "Crear"}</Button>
                        <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>Cancelar</Button>
                    </div>
                </form>
            </EntityFormSheet>
        </div>
    )
}
