import { notFound } from "@tanstack/react-router";
import { AlertCircle, User } from "lucide-react";
import { useMemo } from "react";
import { usePeriodState } from "#/app/providers/period-provider";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { DynamicForm } from "#/shared/components/DynamicForm";
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { PageHeader } from "#/shared/components/PageHeader";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import { useGetResponses } from "#/shared/hooks/useFormResponses";
import { FormModules } from "#/shared/types/dynamic-form";
import type { FormTemplateDef } from "#/shared/types/dynamic-form";
import { useAuth } from "../auth/providers/AuthProvider";
import { useProgramModalities } from "../reference-data/hooks/useProgramModalities";
import { useReportSubmission } from "./hooks/useReportSubmission";
import { useSubmissionGuard } from "./hooks/useSubmissionGuard";
import {
	useSubmittedModalities,
	useSubmittedResponseLimits,
	useSubmittedTotals,
} from "./hooks/useSubmittedModalidades";

interface StudentReportProps {
	formId: string;
	isEmbedded?: boolean;
	onSuccess?: () => void;
}

export function StudentReport({
	formId,
	isEmbedded = false,
	onSuccess,
}: StudentReportProps) {
	// 1. HOOK ZONE
	const { isReadOnly } = usePeriodState();
	const { template, isPending, isError, error } = useFormTemplateByModuleAndId(
		"student",
		formId,
	);
	const { programId, userRole, user } = useAuth();
	const { data: allowedModalities } = useProgramModalities(programId ?? "");
	const { data: responses = [] } = useGetResponses(FormModules.student, formId);

	// Para formularios con step > 1, obtener las modalidades registradas en el formulario anterior (step - 1)
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
		"student",
	);

	const crossStepSourceId = useMemo(() => {
		if (!template) return "";
		if (template.step === 4) return "2";
		if (template.step === 5) return "3";
		return "";
	}, [template]);

	const { data: crossStepLimits } = useSubmittedTotals(
		crossStepSourceId,
		"student",
	);

	const {
		handleFormSubmitRequest,
		isDialogOpen,
		setIsDialogOpen,
		confirmSubmit,
		cancelSubmit,
		resetForm,
		setResetForm,
		initialData,
		editingId,
		handleCancelEdit,
	} = useReportSubmission(formId, template, onSuccess);

	// Guardia de envíos
	const directorResponses = useMemo(() => {
		if (userRole !== "director") return [];
		return responses.filter((r) => r.submittedBy === user?.email);
	}, [responses, userRole, user?.email]);

	const submissionGuard = useSubmissionGuard(template, directorResponses, userRole ?? "");

	const filteredTemplate = useMemo(() => {
		if (!template) return;

		// Para formularios con step > 1, filtrar modalidades por las que se registraron
		// en el formulario anterior. Para step 1, filtrar por las modalidades permitidas del programa.
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
							? // Para follow-up: filtrar por label (que es lo que se guarda en response.modalidad)
								field.options.filter((opt) =>
									modalityFilter.includes(String(opt.label)),
								)
							: // Para step 1: filtrar por value (ID de modalidad del programa)
								field.options.filter((opt) =>
									modalityFilter.includes(String(opt.value)),
								),
					};
				}
				return field;
			}),
		} as FormTemplateDef;
	}, [template, allowedModalities, submittedModalities]);

	// Template con opciones de select ya usadas removidas
	const guardedTemplate = useMemo(() => {
		const base = filteredTemplate || template;
		if (!base) return;
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

	// 3. EARLY RETURNS
	if (isPending) {
		return <DynamicReportPageSkeleton />;
	}

	if (isError) {
		return (
			<DynamicReportPageState
				title="No se pudo cargar el formulario"
				description={
					error instanceof Error
						? error.message
						: "Ocurrió un error al recuperar la plantilla desde la base de datos."
				}
			/>
		);
	}

	if (!template) {
		throw notFound();
	}

	// 4. MAIN RENDER
	return (
		<div
			className={isEmbedded ? "space-y-6" : "w-full max-w-6xl mx-auto py-10"}
			id="page-top"
		>
			{!isEmbedded && (
				<>
					<div className="mb-8">
						<span className="text-xs font-bold uppercase tracking-widest text-primary/60">
							Módulo: {template.module.replace("_", " ")}
						</span>
						<h1 className="text-3xl font-display font-bold mt-2">
							Gestión de Reportes
						</h1>
					</div>

					<PageHeader
						icon={User}
						title={`Formulario: ${template.title}`}
						description="Completa los campos requeridos para enviar el reporte."
					/>
				</>
			)}

			{!isReadOnly && !submissionGuard.canSubmit && !editingId && (
				<div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-lg p-4 text-sm font-medium flex items-center gap-2">
					<AlertCircle className="size-4 shrink-0" />
					{submissionGuard.disabledReason}
				</div>
			)}

			{!isReadOnly && (submissionGuard.canSubmit || editingId) && (
				<DynamicForm
					key={`edit-${editingId ?? "new"}`}
					template={editingId ? filteredTemplate! : guardedTemplate!}
					className="grid grid-cols-1 md:grid-cols-2 gap-4"
					onSubmit={handleFormSubmitRequest}
					resetForm={resetForm}
					setResetForm={setResetForm}
					initialValues={initialData}
					editMode={
						editingId
							? { type: "single", onCancel: handleCancelEdit }
							: { type: "none" }
					}
					submitLabel={editingId ? "Guardar Cambios" : "Enviar Reporte"}
					modalityLimits={modalityLimits}
					crossStepLimits={crossStepLimits}
				/>
			)}

			<AlertDialogCustom
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				message="Confirmar envío"
				description={`Estás a punto de enviar el formulario para el registro de Estudiantes. Revisa que los datos sean correctos antes de continuar.`}
				actionLabel="Enviar Reporte"
				cancelLabel="Revisar de nuevo"
				onConfirm={confirmSubmit}
				onCancel={cancelSubmit}
			/>
		</div>
	);
}
