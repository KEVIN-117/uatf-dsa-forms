import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { BarChart3, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePeriodState } from "#/app/providers/period-provider";
import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import {
	useProgramGraduationModalities,
	useProgramModalities,
} from "#/features/reference-data/hooks/useProgramModalities";
import { GraduatesReport } from "#/features/reports/graduates";
import { useDirectorProgress } from "#/features/reports/hooks/useDirectorProgress";
import {
	useSubmittedModalities,
	useSubmittedResponseLimits,
	useSubmittedTotals,
} from "#/features/reports/hooks/useSubmittedModalidades";
import { useSubmissionGuard } from "#/features/reports/hooks/useSubmissionGuard";
import { ScholarshipReport } from "#/features/reports/scholarship";
import { StudentReport } from "#/features/reports/student";
import { TeacherReport } from "#/features/reports/teacher";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { DynamicForm } from "#/shared/components/DynamicForm";
import { InlineLoader } from "#/shared/components/InlineLoader";
import { Loader } from "#/shared/components/Loader";
import { PageHeader } from "#/shared/components/PageHeader";
import { Toast } from "#/shared/components/Toast";
import { useFormTemplateById } from "#/shared/hooks/useFormBuilder";
import {
	useDeleteFormResponse,
	useGetResponses,
	useUpdateFormResponse,
} from "#/shared/hooks/useFormResponses";
import type {
	FormResponseDef,
	FormTemplateDef,
} from "#/shared/types/dynamic-form";
import { FormModules } from "#/shared/types/dynamic-form";
import { Badge } from "#/shared/ui/badge";
import { Button } from "#/shared/ui/button";
import { Card, CardContent } from "#/shared/ui/card";
import { DataTable } from "#/shared/ui/data-table";
import { EntityFormSheet } from "#/shared/ui/entity-form-sheet";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/shared/ui/select";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "#/shared/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "#/shared/ui/tooltip";
import type { Role } from "#/shared/types";

interface ResponsePanelProps {
	formId: string;
	module: FormModules;
	variant?: "page" | "embedded";
	onEdit?: (response: FormResponseDef) => void;
	onDelete?: (id: string) => void;
}

export function ResponsesPanel({
	formId,
	module,
	variant = "page",
	onEdit,
	onDelete,
}: ResponsePanelProps) {
	// 1. HOOK ZONE
	const { isAuthenticated } = useProtectedRoute();
	const { userRole, user, programId } = useAuth();
	const { selectedPeriodId, isReadOnly } = usePeriodState();
	const navigate = useNavigate();
	const { template, allTemplates = [] } = useFormTemplateById(formId);
	const { data: responses = [], isLoading: isLoadingResponses } =
		useGetResponses(module, formId);

	const updateMutation = useUpdateFormResponse();
	const deleteMutation = useDeleteFormResponse();

	// Creation sheet state
	const [createSheetOpen, setCreateSheetOpen] = useState(false);

	const [editingResponse, setEditingResponse] =
		useState<FormResponseDef | null>(null);
	const [resetEditForm, setResetEditForm] = useState(false);

	const [deleteId, setDeleteId] = useState<string | null>(null);

	// Modality & Progress hooks for template filtering
	const progressQuery = useDirectorProgress();
	const { data: allowedModalities } = useProgramModalities(programId ?? "");
	const { data: allowedGraduationModalities } = useProgramGraduationModalities(
		programId ?? "",
	);

	const previousTemplateId = useMemo(() => {
		if (!template) return "";
		const parts = template.id.split("-");
		const stepNum = Number(parts[0]);
		if (Number.isNaN(stepNum) || stepNum <= 1) return "";
		const prevStep = stepNum - 1;
		return parts.length > 1
			? `${prevStep}-${parts.slice(1).join("-")}`
			: String(prevStep);
	}, [template]);

	const { data: submittedModalities } = useSubmittedModalities(
		previousTemplateId,
		"student",
	);

	const { data: modalityLimits } = useSubmittedResponseLimits(
		previousTemplateId,
		module ?? "",
	);

	const crossStepSource = useMemo(() => {
		if (!template) return null;
		if (module === FormModules.student) {
			if (template.step === 4) return { id: "2", module: "student" };
			if (template.step === 5) return { id: "3", module: "student" };
		}
		if (module === FormModules.scholarships) {
			return { id: "3", module: "student" };
		}
		return null;
	}, [template, module]);

	const { data: crossStepLimits } = useSubmittedTotals(
		crossStepSource?.id ?? "",
		crossStepSource?.module ?? "",
	);

	// Lock state checking for Directors
	const completedSteps = progressQuery.data?.completedSteps || [];
	const isStepLocked = useMemo(() => {
		if (userRole !== "director" || !template || !allTemplates.length)
			return false;

		const allSortedTemplates = [...allTemplates].sort(
			(a, b) => a.step - b.step,
		);
		const nextAvailableTemplate = allSortedTemplates.find(
			(t) => !completedSteps.includes(t.step),
		);
		const currentActiveStep = nextAvailableTemplate
			? nextAvailableTemplate.step
			: Infinity;

		return template.step > currentActiveStep;
	}, [userRole, template, allTemplates, completedSteps]);

	const filteredTemplate = useMemo(() => {
		if (!template) return null;

		if (module === FormModules.student) {
			const isFollowUpForm = template.step > 1;
			const modalityFilter = isFollowUpForm
				? submittedModalities
				: allowedModalities;

			if (!modalityFilter || modalityFilter.length === 0) return template;

			return {
				...template,
				fields: template.fields.map((field) => {
					const isModalityField =
						field.type === "select" &&
						(field.name === "modalidad" ||
							field.label.toLocaleLowerCase().includes("modalidad"));

					if (isModalityField && field.options) {
						return {
							...field,
							options: isFollowUpForm
								? field.options.filter((opt) =>
									modalityFilter.includes(String(opt.label)),
								)
								: field.options.filter((opt) =>
									modalityFilter.includes(String(opt.value)),
								),
						};
					}
					return field;
				}),
			} as FormTemplateDef;
		}

		if (module === FormModules.graduate) {
			if (
				!allowedGraduationModalities ||
				allowedGraduationModalities.length === 0
			)
				return template;

			return {
				...template,
				fields: template.fields.map((field) => {
					const isModalityField =
						field.type === "select" &&
						(field.name === "modalidad" ||
							field.label.toLocaleLowerCase().includes("modalidad"));

					if (isModalityField && field.options) {
						return {
							...field,
							options: field.options.filter((option) =>
								allowedGraduationModalities.includes(String(option.value)),
							),
						};
					}
					return field;
				}),
			} as FormTemplateDef;
		}

		return template;
	}, [
		template,
		module,
		allowedModalities,
		submittedModalities,
		allowedGraduationModalities,
	]);

	// Respuestas del director actual (para la guardia de envíos)
	const directorResponses = useMemo(() => {
		if (userRole !== "director") return [];
		return responses.filter((r) => r.submittedBy === user?.email);
	}, [responses, userRole, user?.email]);

	const submissionGuard = useSubmissionGuard(template, directorResponses, userRole ?? "");

	/**
	 * Template con las opciones de select ya usadas removidas.
	 * Se aplica sobre el filteredTemplate para no perder los filtros de modalidad existentes.
	 * Solo actúa cuando el guard detecta un formulario multi-submit con opciones usadas.
	 */
	const guardedTemplate = useMemo(() => {
		const base = filteredTemplate || template;
		if (!base) return null;
		if (
			userRole !== "director" ||
			submissionGuard.submissionType !== "multi" ||
			!submissionGuard.selectFieldName ||
			submissionGuard.usedSelectValues.length === 0
		) {
			return base;
		}

		return {
			...base,
			fields: base.fields.map((field) => {
				if (
					field.name === submissionGuard.selectFieldName &&
					field.type === "select" &&
					field.options
				) {
					return {
						...field,
						options: field.options.filter(
							(opt) =>
								!submissionGuard.usedSelectValues.includes(String(opt.label)),
						),
					};
				}
				return field;
			}),
		} as FormTemplateDef;
	}, [filteredTemplate, template, submissionGuard, userRole]);


	const handleUpdateResponse = async (
		submittedData: Record<string, any>,
		moduleName: string,
	) => {
		if (!editingResponse) return;
		try {
			const transformedData = Object.entries(submittedData).reduce(
				(acc, [key, value]) => {
					const [_id, name] = key.split("@");
					acc[name || key] = value;
					return acc;
				},
				{} as Record<string, unknown>,
			);

			await updateMutation.mutateAsync({
				id: editingResponse.id,
				module: moduleName as FormModules,
				response: transformedData,
			});

			setEditingResponse(null);
			setResetEditForm(true);
		} catch (error: unknown) {
			Toast({
				title: "Error",
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Error al actualizar el registro",
			});
		}
	};

	const handleDeleteResponse = async (id: string) => {
		try {
			await deleteMutation.mutateAsync({
				module: module,
				id: id,
			});
		} catch (error: unknown) {
			Toast({
				title: "Error",
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Error al eliminar el registro.",
			});
		}
	};

	const isEmbedded = variant === "embedded";

	const translateModuleName = (module: FormModules) => {
		switch (module) {
			case FormModules.student:
				return "Estudiantes";
			case FormModules.graduate:
				return "Graduados";
			case FormModules.teacher:
				return "Docentes";
			case FormModules.scholarships:
				return "Becas";
			default:
				return module;
		}
	};

	useEffect(() => {
		if (template && template.periodId !== selectedPeriodId) {
			const targetTemplate = allTemplates.find(
				(t) =>
					t.module === module &&
					t.step === template.step &&
					t.periodId === selectedPeriodId,
			);
			if (targetTemplate) {
				let targetUrl = "";
				if (isEmbedded) {
					const modulePaths: Record<FormModules, string> = {
						[FormModules.student]: "student-report",
						[FormModules.graduate]: "graduates-report",
						[FormModules.teacher]: "teacher-report",
						[FormModules.scholarships]: "scholarship-report",
					};
					const pathSegment = modulePaths[module];
					targetUrl = `/${pathSegment}/${targetTemplate.id}`;
				} else {
					targetUrl = `/dashboard/reports/${targetTemplate.id}/${module}`;
				}
				navigate({
					to: targetUrl,
					replace: true,
				});
			}
		}
	}, [template, selectedPeriodId, allTemplates, module, navigate, isEmbedded]);
	const [selectedFacultyId, setSelectedFacultyId] = useState<string>("all");
	const [selectedProgramId, setSelectedProgramId] = useState<string>("all");

	const facultyOptions = useMemo(() => {
		const map = new Map<string, string>();
		responses.forEach((r) => {
			if (r.facultyId) map.set(r.facultyId, r.faculty || r.facultyId);
		});
		return Array.from(map.entries())
			.map(([id, name]) => ({ id, name }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [responses]);

	const programOptions = useMemo(() => {
		const map = new Map<string, string>();
		responses.forEach((r) => {
			if (selectedFacultyId !== "all" && r.facultyId !== selectedFacultyId)
				return;
			if (r.programId) map.set(r.programId, r.program || r.programId);
		});
		return Array.from(map.entries())
			.map(([id, name]) => ({ id, name }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [responses, selectedFacultyId]);

	useEffect(() => {
		if (selectedProgramId === "all") return;
		const existsInCurrentFaculty = programOptions.some(
			(p) => p.id === selectedProgramId,
		);
		if (!existsInCurrentFaculty) {
			setSelectedProgramId("all");
		}
	}, [programOptions, selectedProgramId]);



	const filteredResponses = useMemo(() => {
		let list = responses;
		if (userRole === "director") {
			list = list.filter((r) => r.submittedBy === user?.email);
		}
		return list.filter((r) => {
			const byFaculty =
				selectedFacultyId === "all" || r.facultyId === selectedFacultyId;
			const byProgram =
				selectedProgramId === "all" || r.programId === selectedProgramId;
			return byFaculty && byProgram;
		});
	}, [responses, selectedFacultyId, selectedProgramId, userRole, user?.email]);

	const columns = useMemo<ColumnDef<FormResponseDef, any>[]>(() => {
		if (!template) return [];

		const isAdmin = userRole === "administrator";

		const baseColumns: ColumnDef<FormResponseDef, any>[] = [];

		if (isAdmin) {
			baseColumns.push({
				accessorKey: "submittedBy",
				header: "Registrado por",
				cell: (info) => (
					<span className="font-medium text-primary">{info.getValue()}</span>
				),
			});
		}

		baseColumns.push({
			accessorKey: "createdAt",
			header: "Fecha de Registro",
			cell: (info) =>
				new Date(info.getValue()).toLocaleDateString("es-ES", {
					day: "2-digit",
					month: "short",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				}),
		});

		const dynamicColumns: ColumnDef<FormResponseDef, any>[] =
			template.fields.map((field) => ({
				accessorFn: (row: any) => row.response?.[field.name],
				id: field.id,
				header: field.label,
				cell: (info) => {
					const val = info.getValue();
					if (typeof val === "boolean") return val ? "Sí" : "No";
					return val || "-";
				},
			}));

		const finalColumns = [...baseColumns, ...dynamicColumns];

		const showActions = (isAdmin || userRole === "director") && !isReadOnly;

		if (showActions) {
			finalColumns.push({
				id: "actions",
				header: "Acciones",
				cell: ({ row }) => {
					const response = row.original;
					const isOwner = response.submittedBy === user?.email;
					const rowCanEdit = isAdmin || (userRole === "director" && isOwner);
					const rowCanDelete = isAdmin || (userRole === "director" && isOwner);

					return (
						<div className="flex items-center gap-1">
							{rowCanEdit && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => {
												if (onEdit) {
													onEdit(response);
												} else {
													setEditingResponse(response);
												}
											}}
											className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
										>
											<Pencil className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Actualizar Registro</p>
									</TooltipContent>
								</Tooltip>
							)}
							{rowCanDelete && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => {
												if (onDelete) {
													onDelete(response.id);
												} else {
													setDeleteId(response.id);
												}
											}}
											className="h-8 w-8 hover:bg-destructive/10 text-destructive hover:text-destructive"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Eliminar Registro</p>
									</TooltipContent>
								</Tooltip>
							)}
						</div>
					);
				},
			});
		}

		return finalColumns;
	}, [template, userRole, user?.email, isReadOnly, onEdit, onDelete]);

	// 2. EARLY RETURNS
	if (!isAuthenticated || !template) {
		return <Loader text="Cargando resultados..." />;
	}

	// 3. MAIN RENDER
	return (
		<div
			className={
				isEmbedded
					? "space-y-6 mt-16 pt-8 border-t border-border/50"
					: "p-6 space-y-6 max-w-8xl mx-auto"
			}
		>
			<div className="flex flex-col w-full gap-4 lg:flex-row lg:items-start lg:justify-between animate-fade-up">
				{!isEmbedded && (
					<PageHeader
						icon={BarChart3}
						title={`Resultados: ${template.title}`}
						description={`Módulo: ${template.module.toUpperCase()} • Total registros: ${responses.length}`}
					/>
				)}

				{isEmbedded && (
					<h3 className="text-xl font-bold flex items-center gap-2">
						<BarChart3 className="size-5 text-primary" />
						Envíos Registrados
					</h3>
				)}
			</div>

			<div className="flex items-center gap-3 animate-fade-up-delay-1">
				<Badge
					variant="outline"
					className="text-xs px-3 py-1 border-primary/30 bg-primary/5 text-primary"
				>
					{translateModuleName(template.module).toUpperCase()}
				</Badge>
				<Badge
					variant="outline"
					className="text-xs px-3 py-1 border-border/50 text-muted-foreground"
				>
					{responses.length} registros
				</Badge>
				<div className="flex-1" />
				{/* {userRole === "administrator" && (
					<Button
						variant="outline"
						className="font-semibold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
					>
						<FileSpreadsheet className="size-4 mr-2" />
						Exportar a Excel
					</Button>
				)} */}
				{!isReadOnly && !isStepLocked && userRole === "director" && (
					<Button
						onClick={() => setCreateSheetOpen(true)}
						className="font-semibold"
						disabled={!submissionGuard.canSubmit}
					>
						<Plus className="size-4 mr-2" />
						{submissionGuard.canSubmit
							? "Registrar Reporte"
							: submissionGuard.disabledReason}
					</Button>
				)}
			</div>

			{isStepLocked && userRole === "director" && (
				<div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg p-4 text-sm font-medium animate-fade-up font-display">
					Este paso de reporte está bloqueado porque aún no se han completado
					los pasos anteriores en la gestión actual.
				</div>
			)}

			{userRole === "administrator" && (
				<Card className="glass-card animate-fade-up-delay-1">
					<CardContent className="p-4 grid gap-3 md:grid-cols-2">
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground">
								Filtrar por Facultad
							</p>
							<Select
								value={selectedFacultyId}
								onValueChange={setSelectedFacultyId}
							>
								<SelectTrigger>
									<SelectValue placeholder="Todas las facultades" />
								</SelectTrigger>
								<SelectContent className="bg-background">
									<SelectItem value="all">Todas las facultades</SelectItem>
									{facultyOptions.map((f) => (
										<SelectItem key={f.id} value={f.id}>
											{f.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1">
							<p className="text-xs text-muted-foreground">
								Filtrar por Carrera
							</p>
							<Select
								value={selectedProgramId}
								onValueChange={setSelectedProgramId}
							>
								<SelectTrigger>
									<SelectValue placeholder="Todas las carreras" />
								</SelectTrigger>
								<SelectContent className="bg-background">
									<SelectItem value="all">Todas las carreras</SelectItem>
									{programOptions.map((p) => (
										<SelectItem key={p.id} value={p.id}>
											{p.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>
			)}

			<Card className="glass-card overflow-hidden animate-fade-up-delay-2">
				<CardContent className="p-0">
					{isLoadingResponses ? (
						<InlineLoader text="Cargando registros..." />
					) : (
						<DataTable
							columns={columns}
							data={filteredResponses}
							showColumnToggle
							role={userRole as Role}
						/>
					)}
				</CardContent>
			</Card>

			{editingResponse && template && (
				<Sheet
					open={!!editingResponse}
					onOpenChange={(open) => {
						if (!open) setEditingResponse(null);
					}}
				>
					<SheetContent className="sm:max-w-md overflow-y-auto">
						<SheetHeader>
							<SheetTitle>Editar Registro</SheetTitle>
						</SheetHeader>
						<div className="py-4">
							<DynamicForm
								template={(filteredTemplate || template) as FormTemplateDef}
								onSubmit={handleUpdateResponse}
								resetForm={resetEditForm}
								setResetForm={setResetEditForm}
								initialValues={editingResponse.response}
								editMode={{
									type: "single",
									onCancel: () => setEditingResponse(null),
								}}
								submitLabel="Guardar Cambios"
								modalityLimits={modalityLimits}
								crossStepLimits={crossStepLimits}
							/>
						</div>
					</SheetContent>
				</Sheet>
			)}

			{createSheetOpen && template && (
				<EntityFormSheet
					title={`Registrar Reporte: ${template.shortTitle || template.title}`}
					description={`Módulo: ${translateModuleName(template.module).toUpperCase()} • Ingresa los datos correspondientes.`}
					open={createSheetOpen}
					onOpenChange={setCreateSheetOpen}
					className={
						template.hasBulk
							? "sm:max-w-[70vw] w-[95vw] md:w-[85vw] max-w-none!"
							: "sm:max-w-xl w-[95vw]"
					}
				>
					{(() => {
						switch (module) {
							case FormModules.student:
								return (
									<StudentReport
										formId={formId}
										isEmbedded
										onSuccess={() => setCreateSheetOpen(false)}
									/>
								);
							case FormModules.graduate:
								return (
									<GraduatesReport
										formId={formId}
										isEmbedded
										onSuccess={() => setCreateSheetOpen(false)}
									/>
								);
							case FormModules.teacher:
								return (
									<TeacherReport
										formId={formId}
										isEmbedded
										onSuccess={() => setCreateSheetOpen(false)}
									/>
								);
							case FormModules.scholarships:
								return (
									<ScholarshipReport
										formId={formId}
										isEmbedded
										onSuccess={() => setCreateSheetOpen(false)}
									/>
								);
							default:
								return null;
						}
					})()}
				</EntityFormSheet>
			)}

			<AlertDialogCustom
				open={!!deleteId}
				onOpenChange={(open) => {
					if (!open) setDeleteId(null);
				}}
				message="Eliminar registro"
				description="¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer."
				actionLabel="Eliminar"
				cancelLabel="Cancelar"
				onConfirm={async () => {
					if (deleteId) {
						await handleDeleteResponse(deleteId);
						setDeleteId(null);
					}
				}}
				onCancel={() => setDeleteId(null)}
			/>
		</div>
	);
}
