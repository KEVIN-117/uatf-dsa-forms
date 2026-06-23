import { Copy, Plus, Save, ShieldCheck, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePeriodState } from "#/app/providers/period-provider";
import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute";
import { BuilderSkeleton } from "#/features/dynamic-form/components/BuilderSkeleton";
import { FieldEditor } from "#/features/dynamic-form/components/FieldEditor";
import { StatePanel } from "#/features/dynamic-form/components/StatePanel";
import {
	createBlankTemplate,
	createDefaultField,
	generateTemplateId,
	moduleOptions,
	normalizeField,
	normalizeTemplate,
} from "#/features/dynamic-form/utils";
import { DynamicForm } from "#/shared/components/DynamicForm";
import { Toast } from "#/shared/components/Toast";
import {
	useFormTemplates,
	useUpsertFormTemplate,
} from "#/shared/hooks/useFormBuilder";
import type {
	FormFieldDef,
	FormModules,
	FormTemplateDef,
} from "#/shared/types/dynamic-form";
import { Button } from "#/shared/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/shared/ui/card";
import { EntityFormSheet } from "#/shared/ui/entity-form-sheet";
import { Input } from "#/shared/ui/input";
import { Label } from "#/shared/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/shared/ui/select";
import { Switch } from "#/shared/ui/switch";
import { Textarea } from "#/shared/ui/textarea";

export default function FormBuilderPanel() {
	// 1. HOOK ZONE
	const { isLoading, isAuthenticated } = useProtectedRoute();
	const {
		data: templates = [],
		isPending,
		isError,
		error,
	} = useFormTemplates();
	const { mutateAsync: upsertTemplate, isPending: isPendingUpsertTemplate } =
		useUpsertFormTemplate();
	const { isReadOnly, selectedPeriodId } = usePeriodState();
	const [selectedTemplateId, setSelectedTemplateId] = useState<string>("new");
	const [draft, setDraft] = useState<FormTemplateDef>(() =>
		createBlankTemplate(selectedPeriodId),
	);
	const [sheetOpen, setSheetOpen] = useState(false);

	useEffect(() => {
		if (selectedTemplateId === "new") {
			setDraft(createBlankTemplate(selectedPeriodId));
			return;
		}
		const selectedTemplate = templates.find(
			(template) => template.id === selectedTemplateId,
		);
		if (selectedTemplate) {
			setDraft(normalizeTemplate(selectedTemplate));
		}
	}, [selectedTemplateId, templates, selectedPeriodId]);

	const previewTemplate = useMemo(() => normalizeTemplate(draft), [draft]);

	// 2. FUNCTIONS AND LOGIC
	const handleSave = async () => {
		const cleaned = normalizeTemplate({
			...draft,
			periodId: draft.periodId || selectedPeriodId,
		});

		if (!cleaned.id.trim() || !cleaned.title.trim()) {
			Toast({
				title: "Campos incompletos",
				type: "error",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message: "El identificador y el título son obligatorios.",
			});
			return;
		}

		if (cleaned.fields.length === 0) {
			Toast({
				title: "Plantilla vacía",
				type: "warning",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message: "Agrega al menos un campo antes de guardar.",
			});
			return;
		}

		try {
			await upsertTemplate(cleaned);
			setSelectedTemplateId(cleaned.id);
			Toast({
				title: "Plantilla guardada",
				type: "success",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message:
					"Los cambios se han guardado correctamente en la base de datos.",
			});
		} catch (_err) {
			Toast({
				title: "Error",
				type: "error",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message: "Hubo un problema al intentar guardar la plantilla.",
			});
		}
	};

	const handleCreateNew = () => {
		setSelectedTemplateId("new");
	};

	const handleLoadTemplate = (templateId: string) => {
		setSheetOpen(false);
		setSelectedTemplateId(templateId);
	};

	const handleDuplicate = () => {
		const duplicated = normalizeTemplate({
			...draft,
			id: generateTemplateId(draft.title || "template"),
			periodId: selectedPeriodId,
			title: draft.title ? `Copia de ${draft.title}` : "Nueva plantilla",
		});

		setDraft(duplicated);
		setSelectedTemplateId("new");
		Toast({
			title: "Plantilla duplicada",
			type: "success",
			duration: 5000,
			closeButton: true,
			position: "top-right",
			message: "Revisa el nuevo identificador antes de guardar.",
		});
	};

	const updateTemplate = (patch: Partial<FormTemplateDef>) => {
		setDraft((current) => normalizeTemplate({ ...current, ...patch }));
	};

	const updateField = (fieldId: string, patch: Partial<FormFieldDef>) => {
		setDraft((current) => ({
			...current,
			fields: current.fields.map((field) =>
				field.id === fieldId ? normalizeField({ ...field, ...patch }) : field,
			),
		}));
	};

	const addField = () => {
		setDraft((current) => ({
			...current,
			fields: [
				...current.fields,
				createDefaultField(current.fields.length + 1),
			],
		}));
	};

	const removeField = (fieldId: string) => {
		setDraft((current) => {
			const fields = current.fields.filter((field) => field.id !== fieldId);
			return {
				...current,
				fields: fields.length > 0 ? fields : [createDefaultField(1)],
			};
		});
	};

	const moveField = (fieldId: string, direction: "up" | "down") => {
		setDraft((current) => {
			const index = current.fields.findIndex((field) => field.id === fieldId);
			if (index < 0) return current;

			const nextIndex = direction === "up" ? index - 1 : index + 1;
			if (nextIndex < 0 || nextIndex >= current.fields.length) return current;

			const fields = [...current.fields];
			const [item] = fields.splice(index, 1);
			fields.splice(nextIndex, 0, item);

			return { ...current, fields };
		});
	};

	const cloneField = (fieldId: string) => {
		setDraft((current) => {
			const target = current.fields.find((field) => field.id === fieldId);
			if (!target) return current;

			const cloned = normalizeField({
				...target,
				id: generateTemplateId(target.id),
				label: `${target.label} (copy)`,
			});

			const index = current.fields.findIndex((field) => field.id === fieldId);
			const fields = [...current.fields];
			fields.splice(index + 1, 0, cloned);

			return { ...current, fields };
		});

		Toast({
			title: "Campo clonado",
			type: "success",
			duration: 5000,
			closeButton: true,
			position: "top-right",
			message: "El campo se ha copiado correctamente.",
		});
	};

	// 3. EARLY RETURNS
	if (isLoading || isPending) return <BuilderSkeleton />;
	if (!isAuthenticated) return null;

	if (isError) {
		return (
			<StatePanel
				title="No se pudo cargar el builder"
				description={
					error instanceof Error
						? error.message
						: "No fue posible leer las plantillas desde Firestore."
				}
			/>
		);
	}

	// 4. MAIN RENDER
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div className="space-y-2">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
						<ShieldCheck className="size-3.5" />
						Form Builder
					</div>
					<h1 className="text-3xl font-display font-bold text-foreground">
						Constructor de formularios
					</h1>
					<p className="max-w-2xl text-sm text-muted-foreground">
						En esta sección el usuario puede crear plantillas para formularios y
						personalizarlas a su gusto.
					</p>
				</div>
				{/* Botones de acción */}
				<div className="flex flex-wrap gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={handleCreateNew}
						disabled={isReadOnly}
					>
						<Plus className="size-4" />
						Nueva plantilla
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => setSheetOpen(true)}
					>
						<Upload className="size-4" />
						Cargar plantilla
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={handleDuplicate}
						disabled={!draft.title.trim() || isReadOnly}
					>
						<Copy className="size-4" />
						Duplicar
					</Button>
					<Button
						type="button"
						onClick={handleSave}
						disabled={isPendingUpsertTemplate || isReadOnly}
						className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
					>
						<Save className="size-4" />
						{isPendingUpsertTemplate ? "Guardando..." : "Guardar plantilla"}
					</Button>
				</div>
			</div>

			{isReadOnly && (
				<div className="mb-6 flex items-center gap-2 p-4 text-sm rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium animate-fade-in">
					<span>
						⚠️ Modo Solo Lectura: La gestión académica seleccionada no está
						activa o se encuentra cerrada. No se permiten realizar
						modificaciones a las plantillas.
					</span>
				</div>
			)}

			<div className="grid gap-6 xl:grid-cols-[2.5fr_1.5fr]">
				<EntityFormSheet
					title={"Cargar plantilla"}
					description="Carga una plantilla existente para editarla o crea una nueva."
					open={sheetOpen}
					onOpenChange={setSheetOpen}
					side="bottom"
					className="max-h-[75vh] overflow-y-auto"
				>
					{/* Sidebar con las plantillas guardadas */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Plantillas guardadas</CardTitle>
								<CardDescription>
									Selecciona una plantilla para editarla o comienza una nueva.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2 overflow-y-auto grid grid-cols-3 gap-4">
								<button
									type="button"
									onClick={handleCreateNew}
									className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
										selectedTemplateId === "new"
											? "border-primary bg-primary/5"
											: "border-border hover:bg-accent"
									}`}
								>
									<span className="font-medium">Nueva plantilla</span>
									<span className="text-xs text-muted-foreground">Blank</span>
								</button>

								{templates.map((template) => (
									<button
										key={template.id}
										type="button"
										onClick={() => handleLoadTemplate(template.id)}
										className={`flex w-full flex-col gap-1 rounded-lg border px-3 py-2 text-left transition-colors ${
											selectedTemplateId === template.id
												? "border-primary bg-primary/5"
												: "border-border hover:bg-accent"
										}`}
									>
										<span className="font-medium">{template.title}</span>
										<span className="text-xs text-muted-foreground">
											{template.id} · {template.module}
										</span>
									</button>
								))}
							</CardContent>
						</Card>
					</div>
				</EntityFormSheet>

				{/* Panel de edición */}
				<main className="space-y-6">
					<Card>
						<CardHeader className="flex flex-row items-start justify-between gap-4">
							<div>
								<CardTitle>Campos</CardTitle>
								<CardDescription>
									Cada campo representa una entrada del formulario renderizado.
								</CardDescription>
							</div>
							<Button
								type="button"
								variant="outline"
								onClick={addField}
								disabled={isReadOnly}
							>
								<Plus className="size-4" />
								Agregar campo
							</Button>
						</CardHeader>
						<CardContent className="space-y-4">
							{draft.fields.map((field, index) => (
								<FieldEditor
									key={`${field.id}`}
									field={field}
									index={index}
									total={draft.fields.length}
									onChange={(patch) => updateField(field.id, patch)}
									onDelete={() => removeField(field.id)}
									onMoveUp={() => moveField(field.id, "up")}
									onMoveDown={() => moveField(field.id, "down")}
									onClone={() => cloneField(field.id)}
									disabled={isReadOnly}
								/>
							))}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Vista previa</CardTitle>
							<CardDescription>
								Este es el renderer que verá el usuario final con la plantilla
								que estás editando.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<DynamicForm
								template={previewTemplate}
								onSubmit={async () => {
									Toast({
										title: "Vista previa enviada",
										type: "success",
										duration: 5000,
										closeButton: true,
										position: "top-right",
										message:
											"Revisa la consola para ver la estructura de los datos.",
									});
								}}
								resetForm={false}
								setResetForm={() => {}}
							/>
						</CardContent>
					</Card>
				</main>

				{/* Panel de metadata */}
				<aside className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Metadata</CardTitle>
							<CardDescription>
								Define la identidad de la plantilla.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="template-id">ID</Label>
								<Input
									id="template-id"
									value={draft.id}
									onChange={(event) =>
										updateTemplate({ id: event.target.value })
									}
									placeholder="template_student_report"
									disabled={isReadOnly}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="template-title">Título</Label>
								<Input
									id="template-title"
									value={draft.title}
									onChange={(event) =>
										updateTemplate({ title: event.target.value })
									}
									placeholder="Reporte de estudiantes"
									disabled={isReadOnly}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="template-shortTitle">
									Título en menú (Corto)
								</Label>
								<Input
									id="template-shortTitle"
									value={draft.shortTitle ?? ""}
									onChange={(event) =>
										updateTemplate({ shortTitle: event.target.value })
									}
									placeholder="Ej. Post. Admitidos"
									disabled={isReadOnly}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="template-description">Descripción</Label>
								<Textarea
									id="template-description"
									value={draft.description ?? ""}
									onChange={(event) =>
										updateTemplate({ description: event.target.value })
									}
									placeholder="Describe brevemente el formulario"
									className="min-h-80"
									disabled={isReadOnly}
								/>
							</div>

							<div className="grid grid-cols-1 gap-4">
								<div className="space-y-2">
									<Label>Módulo</Label>
									<Select
										value={draft.module}
										disabled={isReadOnly}
										onValueChange={(value) =>
											updateTemplate({ module: value as FormModules })
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Selecciona un módulo" />
										</SelectTrigger>
										<SelectContent
											position="popper"
											align="start"
											className="bg-background"
										>
											{moduleOptions.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>Paso</Label>
									<Input
										type="number"
										value={draft.step}
										disabled={isReadOnly}
										onChange={(event) =>
											updateTemplate({ step: Number(event.target.value) })
										}
									/>
								</div>
								<div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
									<div className="flex flex-col">
										<p className="text-sm font-medium">Envio masivo</p>
										<p className="text-xs text-muted-foreground">
											Permite enviar multiples respuestas
										</p>
									</div>
									<Switch
										checked={draft.hasBulk}
										disabled={isReadOnly}
										onCheckedChange={(checked) =>
											updateTemplate({ hasBulk: checked })
										}
									/>
								</div>

								<div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
									<div>
										<p className="text-sm font-medium">Activo</p>
										<p className="text-xs text-muted-foreground">
											Habilita o deshabilita la plantilla.
										</p>
									</div>
									<Switch
										checked={draft.isActive}
										disabled={isReadOnly}
										onCheckedChange={(checked) =>
											updateTemplate({ isActive: checked })
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</aside>
			</div>
		</div>
	);
}
