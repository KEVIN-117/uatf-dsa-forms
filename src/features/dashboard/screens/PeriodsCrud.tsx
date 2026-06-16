import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute";
import {
	useAddPeriod,
	useDeletePeriod,
	usePeriods,
	useUpdatePeriod,
} from "#/features/reference-data/hooks/usePeriods";
import { InlineLoader } from "#/shared/components/InlineLoader";
import { Loader } from "#/shared/components/Loader";
import { PageHeader } from "#/shared/components/PageHeader";
import { Toast } from "#/shared/components/Toast";
import type { Period } from "#/shared/types";
import { Badge } from "#/shared/ui/badge";
import { Button } from "#/shared/ui/button";
import { Card, CardContent } from "#/shared/ui/card";
import { DataTable } from "#/shared/ui/data-table";
import { EntityFormSheet } from "#/shared/ui/entity-form-sheet";
import { Input } from "#/shared/ui/input";
import { Label } from "#/shared/ui/label";
import { Switch } from "#/shared/ui/switch";

type PeriodFormData = {
	id: string;
	name: string;
	isActive: boolean;
	isClosed: boolean;
	startDate: string;
	endDate: string;
};

const emptyForm: PeriodFormData = {
	id: "",
	name: "",
	isActive: false,
	isClosed: false,
	startDate: "",
	endDate: "",
};

const formatDateToInput = (dateVal: any): string => {
	if (!dateVal) return "";
	let date: Date;
	if (typeof dateVal.toDate === "function") {
		date = dateVal.toDate();
	} else {
		date = new Date(dateVal);
	}
	if (Number.isNaN(date.getTime())) return "";

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export function PeriodsCrud() {
	// 1. PROTECT ROUTE
	const { isLoading: authLoading, isAuthenticated } = useProtectedRoute();

	// 2. QUERY & MUTATION HOOKS
	const { data: periods = [], isLoading } = usePeriods();
	const addMut = useAddPeriod();
	const updateMut = useUpdatePeriod();
	const deleteMut = useDeletePeriod();

	// 3. COMPONENT STATE
	const [sheetOpen, setSheetOpen] = useState(false);
	const [editing, setEditing] = useState<Period | null>(null);
	const [form, setForm] = useState<PeriodFormData>(emptyForm);

	// 4. ACTION HANDLERS
	const openCreate = () => {
		setEditing(null);
		setForm(emptyForm);
		setSheetOpen(true);
	};

	const openEdit = (item: Period) => {
		setEditing(item);
		setForm({
			id: item.id,
			name: item.name,
			isActive: item.isActive,
			isClosed: item.isClosed,
			startDate: formatDateToInput(item.startDate),
			endDate: formatDateToInput(item.endDate),
		});
		setSheetOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const start = form.startDate
				? new Date(`${form.startDate}T00:00:00`)
				: null;
			const end = form.endDate ? new Date(`${form.endDate}T23:59:59`) : null;

			const periodData = {
				id: form.id.trim(),
				name: form.name.trim(),
				isActive: form.isActive,
				isClosed: form.isClosed,
				startDate: start,
				endDate: end,
			};

			if (editing) {
				await updateMut.mutateAsync({
					...periodData,
					docId: editing.docId,
				});
				Toast({
					title: "Periodo actualizado",
					type: "success",
					duration: 5000,
					closeButton: true,
					position: "top-right",
					message: "Periodo académico actualizado correctamente.",
				});
			} else {
				// Check for duplicates in memory list first
				if (periods.some((p) => p.id === periodData.id)) {
					Toast({
						title: "ID duplicado",
						type: "error",
						duration: 5000,
						closeButton: true,
						position: "top-right",
						message: "Ya existe un periodo con este ID (Año).",
					});
					return;
				}

				await addMut.mutateAsync(periodData);
				Toast({
					title: "Periodo creado",
					type: "success",
					duration: 5000,
					closeButton: true,
					position: "top-right",
					message: "Periodo académico creado correctamente.",
				});
			}
			setSheetOpen(false);
			setForm(emptyForm);
		} catch (error) {
			console.error("Error al guardar periodo:", error);
			Toast({
				title: "Error al guardar",
				type: "error",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message: "Error al guardar el periodo académico.",
			});
		}
	};

	const handleDelete = async (item: Period) => {
		if (!confirm(`¿Eliminar la gestión "${item.name}"?`)) return;
		try {
			await deleteMut.mutateAsync(item.docId);
			Toast({
				title: "Periodo eliminado",
				type: "success",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message: "Periodo académico eliminado correctamente.",
			});
		} catch (error) {
			console.error("Error al eliminar periodo:", error);
			Toast({
				title: "Error al eliminar",
				type: "error",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message: "Error al eliminar el periodo académico.",
			});
		}
	};

	// 5. COLUMN DEFINITION
	const columns: ColumnDef<Period>[] = [
		{ accessorKey: "id", header: "ID (Año)" },
		{ accessorKey: "name", header: "Nombre de Gestión" },
		{
			accessorKey: "isActive",
			header: "Estado Activo",
			cell: ({ row }) =>
				row.original.isActive ? (
					<Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
						Activo
					</Badge>
				) : (
					<Badge variant="secondary" className="opacity-70">
						Inactivo
					</Badge>
				),
		},
		{
			accessorKey: "isClosed",
			header: "Estado Sistema",
			cell: ({ row }) =>
				row.original.isClosed ? (
					<Badge
						variant="destructive"
						className="bg-destructive/10 text-destructive border border-destructive/20"
					>
						Cerrado
					</Badge>
				) : (
					<Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
						Abierto
					</Badge>
				),
		},
		{
			accessorKey: "startDate",
			header: "Fecha de Inicio",
			cell: ({ row }) => {
				const val = row.original.startDate;
				if (!val) return "-";
				const date =
					typeof val.toDate === "function" ? val.toDate() : new Date(val);
				return Number.isNaN(date.getTime())
					? "-"
					: date.toLocaleDateString("es-ES");
			},
		},
		{
			accessorKey: "endDate",
			header: "Fecha de Finalización",
			cell: ({ row }) => {
				const val = row.original.endDate;
				if (!val) return "-";
				const date =
					typeof val.toDate === "function" ? val.toDate() : new Date(val);
				return Number.isNaN(date.getTime())
					? "-"
					: date.toLocaleDateString("es-ES");
			},
		},
		{
			id: "actions",
			header: "Acciones",
			enableColumnFilter: false,
			enableSorting: false,
			cell: ({ row }) => (
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
						onClick={() => openEdit(row.original)}
					>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
						onClick={() => handleDelete(row.original)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			),
		},
	];

	// 6. EARLY RETURNS
	if (authLoading) return <Loader />;
	if (!isAuthenticated) return null;

	// 7. RENDER SCREEN
	return (
		<div className="p-6 space-y-6 max-w-8xl mx-auto animate-fade-in">
			<PageHeader
				icon={Calendar}
				title="Gestión de Periodos"
				description="Administra los periodos académicos y gestiones anuales de la universidad"
				action={{
					label: "Nuevo Periodo",
					icon: Plus,
					onClick: openCreate,
				}}
			/>

			<Card className="glass-card overflow-hidden animate-fade-up-delay-1">
				<CardContent className="p-0">
					{isLoading ? (
						<InlineLoader text="Cargando periodos académicos..." />
					) : (
						<DataTable
							columns={columns}
							data={periods}
							searchPlaceholder="Buscar periodos..."
							showColumnToggle
						/>
					)}
				</CardContent>
			</Card>

			<EntityFormSheet
				title={editing ? "Editar Periodo" : "Nuevo Periodo"}
				description={
					editing
						? "Modifica los datos del periodo académico"
						: "Ingresa los datos del nuevo periodo académico"
				}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
			>
				<form onSubmit={handleSubmit} className="space-y-4 pt-4">
					<div className="space-y-2">
						<Label htmlFor="period-id">ID / Año</Label>
						<Input
							id="period-id"
							value={form.id}
							onChange={(e) => setForm({ ...form, id: e.target.value })}
							placeholder="Ej: 2026"
							disabled={!!editing}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="period-name">Nombre de Gestión</Label>
						<Input
							id="period-name"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							placeholder="Ej: Gestión Académica 2026"
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="period-start">Fecha de Inicio</Label>
							<Input
								id="period-start"
								type="date"
								value={form.startDate}
								onChange={(e) =>
									setForm({ ...form, startDate: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="period-end">Fecha de Fin</Label>
							<Input
								id="period-end"
								type="date"
								value={form.endDate}
								onChange={(e) => setForm({ ...form, endDate: e.target.value })}
								required
							/>
						</div>
					</div>

					<div className="flex items-center justify-between py-2 border-b border-border/40">
						<div className="space-y-0.5">
							<Label htmlFor="period-active" className="text-sm font-semibold">
								Periodo Activo
							</Label>
							<p className="text-xs text-muted-foreground">
								Activa este periodo como el actual en curso (desactiva otros).
							</p>
						</div>
						<Switch
							id="period-active"
							checked={form.isActive}
							onCheckedChange={(val) => setForm({ ...form, isActive: val })}
						/>
					</div>

					<div className="flex items-center justify-between py-2 border-b border-border/40">
						<div className="space-y-0.5">
							<Label htmlFor="period-closed" className="text-sm font-semibold">
								Periodo Cerrado
							</Label>
							<p className="text-xs text-muted-foreground">
								Impide la modificación de datos y envío de formularios.
							</p>
						</div>
						<Switch
							id="period-closed"
							checked={form.isClosed}
							onCheckedChange={(val) => setForm({ ...form, isClosed: val })}
						/>
					</div>

					<div className="flex gap-2 pt-4">
						<Button
							type="submit"
							className="flex-1"
							disabled={addMut.isPending || updateMut.isPending}
						>
							{addMut.isPending || updateMut.isPending
								? "Guardando..."
								: editing
									? "Actualizar"
									: "Crear"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => setSheetOpen(false)}
						>
							Cancelar
						</Button>
					</div>
				</form>
			</EntityFormSheet>
		</div>
	);
}
