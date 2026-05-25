import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2, Plus, Award } from "lucide-react"

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
import { Card, CardContent } from "#/shared/ui/card"
import { Toast } from "#/shared/components/Toast"
import { PageHeader } from "#/shared/components/PageHeader"
import { InlineLoader } from "#/shared/components/InlineLoader"
import { Loader } from "#/shared/components/Loader"

type GradFormData = Omit<GraduationModality, "docId">
const emptyForm: GradFormData = { id: "", name: "", code: "" }

export function GraduationModalitiesCrud() {
    // 1. HOOK ZONE
    const { isLoading: authLoading, isAuthenticated } = useProtectedRoute()
    const { data: modalities = [], isLoading } = useGraduationModalities()
    const addMut = useAddGraduationModality()
    const updateMut = useUpdateGraduationModality()
    const deleteMut = useDeleteGraduationModality()

    const [sheetOpen, setSheetOpen] = useState(false)
    const [editing, setEditing] = useState<GraduationModality | null>(null)
    const [form, setForm] = useState<GradFormData>(emptyForm)

    // 2. FUNCTIONS AND LOGIC
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
                Toast({
                    title: "Modalidad actualizada",
                    type: "success",
                    duration: 5000,
                    closeButton: true,
                    position: 'top-right',
                    message: "Modalidad de graduación actualizada correctamente.",
                });
            } else {
                await addMut.mutateAsync(form)
                Toast({
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
            Toast({
                title: "Error al guardar",
                type: "error",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: "Error al guardar la modalidad.",
            });
        }
    }

    const handleDelete = async (item: GraduationModality) => {
        if (!confirm(`¿Eliminar "${item.name}"?`)) return
        try {
            await deleteMut.mutateAsync(item.docId);
            Toast({
                title: "Modalidad eliminada",
                type: "success",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: "Modalidad de graduación eliminada correctamente.",
            });
        } catch {
            Toast({
                title: "Error al eliminar",
                type: "error",
                duration: 5000,
                closeButton: true,
                position: 'top-right',
                message: "Error al eliminar la modalidad.",
            });
        }
    }

    const columns: ColumnDef<GraduationModality>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Nombre" },
        { accessorKey: "code", header: "Código" },
        {
            id: "actions", header: "Acciones", enableColumnFilter: false, enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => openEdit(row.original)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors" onClick={() => handleDelete(row.original)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            ),
        },
    ]

    // 3. EARLY RETURNS
    if (authLoading) return <Loader />
    if (!isAuthenticated) return null

    // 4. MAIN RENDER
    return (
        <div className="p-6 space-y-6 max-w-8xl mx-auto">
            <PageHeader
                icon={Award}
                title="Modalidades de Graduación"
                description="Gestiona las modalidades de graduación de la universidad"
                action={{
                    label: "Agregar Modalidad",
                    icon: Plus,
                    onClick: openCreate,
                }}
            />

            <Card className="glass-card overflow-hidden animate-fade-up-delay-1">
                <CardContent className="p-0">
                    {isLoading ? (
                        <InlineLoader text="Cargando modalidades..." />
                    ) : (
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
