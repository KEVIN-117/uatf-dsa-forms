import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"

import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute"
import {
    useGraduationModalities,
    useAddGraduationModality,
    useUpdateGraduationModality,
    useDeleteGraduationModality,
} from "#/features/reference-data/hooks/useGraduationModalities"
import type { GraduationModality } from "#/shared/types"
import { DataTable } from "#/shared/ui/data-table"
import { EntityFormSheet } from "#/shared/ui/entity-form-sheet"
import { Button } from "#/shared/ui/button"
import { Input } from "#/shared/ui/input"
import { Label } from "#/shared/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card"

type GradFormData = Omit<GraduationModality, "docId">
const emptyForm: GradFormData = { id: "", name: "", code: "" }

export function GraduationModalitiesCrud() {
    const { isLoading: authLoading, isAuthenticated } = useProtectedRoute()
    const { data: modalities = [], isLoading } = useGraduationModalities()
    const addMut = useAddGraduationModality()
    const updateMut = useUpdateGraduationModality()
    const deleteMut = useDeleteGraduationModality()

    const [sheetOpen, setSheetOpen] = useState(false)
    const [editing, setEditing] = useState<GraduationModality | null>(null)
    const [form, setForm] = useState<GradFormData>(emptyForm)

    const openCreate = () => { setEditing(null); setForm(emptyForm); setSheetOpen(true) }
    const openEdit = (item: GraduationModality) => {
        setEditing(item)
        setForm({ id: item.id, name: item.name, code: item.code })
        setSheetOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editing) {
                await updateMut.mutateAsync({ ...form, docId: editing.docId })
                toast.success("Modalidad de graduación actualizada")
            } else {
                await addMut.mutateAsync(form)
                toast.success("Modalidad de graduación creada")
            }
            setSheetOpen(false); setForm(emptyForm)
        } catch { toast.error("Error al guardar") }
    }

    const handleDelete = async (item: GraduationModality) => {
        if (!confirm(`¿Eliminar "${item.name}"?`)) return
        try { await deleteMut.mutateAsync(item.docId); toast.success("Eliminada") }
        catch { toast.error("Error al eliminar") }
    }

    const columns: ColumnDef<GraduationModality>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Nombre" },
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

    if (authLoading) return <div className="flex h-full items-center justify-center">Verificando sesión...</div>
    if (!isAuthenticated) return null

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="text-2xl font-display">Modalidades de Graduación</CardTitle>
                        <CardDescription>Gestiona las modalidades de graduación de la universidad</CardDescription>
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
                    <div className="space-y-2"><Label htmlFor="gm-id">ID</Label><Input id="gm-id" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="Ej: 1" required /></div>
                    <div className="space-y-2"><Label htmlFor="gm-name">Nombre</Label><Input id="gm-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: TESIS DE GRADO" required /></div>
                    <div className="space-y-2"><Label htmlFor="gm-code">Código</Label><Input id="gm-code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Ej: TG" required /></div>
                    <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1" disabled={addMut.isPending || updateMut.isPending}>{(addMut.isPending || updateMut.isPending) ? "Guardando..." : editing ? "Actualizar" : "Crear"}</Button>
                        <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>Cancelar</Button>
                    </div>
                </form>
            </EntityFormSheet>
        </div>
    )
}
