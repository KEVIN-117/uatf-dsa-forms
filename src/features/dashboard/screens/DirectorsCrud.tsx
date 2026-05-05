import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute";
import { useAddUser, useDeleteUser, useUpdateUser, useUsers } from "#/features/reference-data/useUsers";
import { useFaculties } from "#/features/reference-data/hooks/useFaculties";
import { usePrograms } from "#/features/reference-data/hooks/usePrograms";
import { useAllResponses } from "#/shared/hooks/useFormResponses";
import type { Role, User } from "#/shared/types";
import { DataTable } from "#/shared/ui/data-table";
import { EntityFormSheet } from "#/shared/ui/entity-form-sheet";
import { Button } from "#/shared/ui/button";
import { Input } from "#/shared/ui/input";
import { Label } from "#/shared/ui/label";
import { Card, CardContent } from "#/shared/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/shared/ui/select";
import { Loader } from "#/shared/components/Loader";
import { InlineLoader } from "#/shared/components/InlineLoader";
import { PageHeader } from "#/shared/components/PageHeader";
import { Badge } from "#/shared/ui/badge";

type DirectorFormData = Omit<User, "docId" | "createdAt" | "updatedAt">;

const emptyForm: DirectorFormData = {
  ci: 0, email: "", facultyId: "", maternalSurname: "", name: "", paternalSurname: "", programId: "", role: "director" as Role,
};

export function DirectorsCrud() {
  const { isLoading: authLoading, isAuthenticated } = useProtectedRoute();
  const { data: users = [], isLoading } = useUsers();
  const { data: faculties = [] } = useFaculties();
  const { data: programs = [] } = usePrograms();
  const { data: responses = [] } = useAllResponses();
  const addMutation = useAddUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [form, setForm] = useState<DirectorFormData>(emptyForm);

  const directors = useMemo(() => users.filter((u) => u.role === "director"), [users]);
  const responsesByEmail = useMemo(() => {
    const map = new Map<string, number>();

    if (!responses || responses.length === 0) {
      return map;
    }

    responses.forEach((r) => {
      const responseKey = r?.submittedBy;
      if (!responseKey) return;

      map.set(responseKey, (map.get(responseKey) ?? 0) + 1);
    });

    return map;
  }, [responses]);


  const getFacultyName = (id: string) => faculties.find((f) => f.id === id)?.name ?? id;
  const getProgramName = (id: string) => programs.find((p) => p.id === id)?.name ?? id;

  const openCreateSheet = () => { setEditingItem(null); setForm(emptyForm); setSheetOpen(true); };
  const openEditSheet = (item: User) => { setEditingItem(item); setForm({ ...item, role: "director" as Role }); setSheetOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) await updateMutation.mutateAsync({ ...editingItem, ...form });
    else await addMutation.mutateAsync(form);
    setSheetOpen(false);
    setForm(emptyForm);
  };

  const handleDelete = async (item: User) => {
    if (!item.docId) return;
    if (!confirm(`¿Eliminar director ${item.name} ${item.paternalSurname}?`)) return;
    await deleteMutation.mutateAsync(item.docId);
  };

  const columns: ColumnDef<User>[] = [
    { accessorKey: "ci", header: "CI" },
    { accessorKey: "name", header: "Nombre", cell: ({ row }) => `${row.original.name} ${row.original.paternalSurname} ${row.original.maternalSurname}` },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "facultyId", header: "Facultad", cell: ({ row }) => getFacultyName(row.original.facultyId) },
    { accessorKey: "programId", header: "Carrera", cell: ({ row }) => getProgramName(row.original.programId) },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const count = responsesByEmail.get(row.original.email) ?? 0;
        return count > 0
          ? <Badge variant="outline" className="text-emerald-600 border-emerald-500/40 bg-emerald-500/10 dark:text-emerald-400">Enviado</Badge>
          : <Badge variant="outline" className="text-amber-600 border-amber-500/40 bg-amber-500/10 dark:text-amber-400">Pendiente</Badge>;
      },
      filterFn: (row, _columnId, value) => {
        const count = responsesByEmail.get(row.original.email) ?? 0;
        if (value === "Enviado") return count > 0;
        if (value === "Pendiente") return count === 0;
        return true;
      },
      meta: {
        filterOptions: ["Enviado", "Pendiente"],
      },
    },
    {
      id: "actions", header: "Acciones", enableColumnFilter: false, enableSorting: false, cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => openEditSheet(row.original)}><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors" onClick={() => handleDelete(row.original)}><Trash2 className="h-4 w-4" /></Button>
        </div>
      )
    },
  ];

  if (authLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="p-6 space-y-6 max-w-8xl mx-auto">
      <PageHeader
        icon={Users}
        title="Directores"
        description="Gestiona directores y verifica envío de formularios"
        action={{
          label: "Agregar Director",
          icon: Plus,
          onClick: openCreateSheet,
        }}
      />

      <Card className="glass-card overflow-hidden animate-fade-up-delay-1">
        <CardContent className="p-0">
          {isLoading ? <InlineLoader text="Cargando directores..." /> : <DataTable columns={columns} data={directors} searchPlaceholder="Buscar directores..." showColumnToggle />}
        </CardContent>
      </Card>

      <EntityFormSheet title={editingItem ? "Editar Director" : "Nuevo Director"} description="Datos de cuenta y asignación académica" open={sheetOpen} onOpenChange={setSheetOpen}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ci">CI</Label>
            <Input id="ci" type="number" value={form.ci} onChange={(e) => setForm({ ...form, ci: Number(e.target.value) })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ps">Apellido Paterno</Label>
            <Input id="ps" value={form.paternalSurname} onChange={(e) => setForm({ ...form, paternalSurname: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ms">Apellido Materno</Label>
            <Input id="ms" value={form.maternalSurname} onChange={(e) => setForm({ ...form, maternalSurname: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Facultad</Label>
            <Select value={form.facultyId} onValueChange={(value) => setForm({ ...form, facultyId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar facultad" />
              </SelectTrigger>
              <SelectContent className="bg-accent">{faculties.map((f) => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Carrera</Label>
            <Select value={form.programId} onValueChange={(value) => setForm({ ...form, programId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar carrera" /></SelectTrigger>
              <SelectContent className="bg-accent">{programs.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={addMutation.isPending || updateMutation.isPending}>{(addMutation.isPending || updateMutation.isPending) ? "Guardando..." : editingItem ? "Actualizar" : "Crear"}</Button>
            <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </EntityFormSheet>
    </div>
  );
}
