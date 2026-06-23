import { notFound } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { useMemo } from "react";
import { usePeriodState } from "#/app/providers/period-provider";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { DynamicForm } from "#/shared/components/DynamicForm";
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { PageHeader } from "#/shared/components/PageHeader";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import type { FormTemplateDef } from "#/shared/types/dynamic-form";
import { useAuth } from "../auth/providers/AuthProvider";
import { useProgramGraduationModalities } from "../reference-data/hooks/useProgramModalities";
import { useReportSubmission } from "./hooks/useReportSubmission";

interface GraduatesReportProps {
	formId: string;
	isEmbedded?: boolean;
	onSuccess?: () => void;
}

export function GraduatesReport({
	formId,
	isEmbedded = false,
	onSuccess,
}: GraduatesReportProps) {
	// 1. HOOK ZONE
	const { isReadOnly } = usePeriodState();
	const { template, isPending, isError, error } = useFormTemplateByModuleAndId(
		"graduate",
		formId,
	);
	const { programId } = useAuth();

	const {
		handleFormSubmitRequest,
		isDialogOpen,
		setIsDialogOpen,
		confirmSubmit,
		cancelSubmit,
		resetForm: resetResponseForm,
		setResetForm: setResetResponseForm,
		initialData,
		editingId,
		handleCancelEdit,
	} = useReportSubmission(formId, template, onSuccess);

	const { data: allowedGraduationModalities } = useProgramGraduationModalities(
		programId ?? "",
	);

	const filteredTemplate = useMemo(() => {
		if (!template) return;

		if (
			!allowedGraduationModalities ||
			allowedGraduationModalities.length === 0
		)
			return template;

		return {
			...template,
			fields: template.fields.map((field) => {
				const isGraduationModalityField =
					field.type === "select" &&
					(field.name === "modalidad" ||
						field.label.toLocaleLowerCase().includes("modalidad"));

				if (isGraduationModalityField && field.options) {
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
	}, [template, allowedGraduationModalities]);

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

	// 4. MAIN RENDER (non-bulk)
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
						icon={GraduationCap}
						title={`Formulario: ${template.title}`}
						description="Completa los campos requeridos para enviar el reporte."
					/>
				</>
			)}
			{!isReadOnly && (
				<DynamicForm
					key={`edit-${editingId ?? "new"}`}
					template={filteredTemplate!}
					className="grid grid-cols-1 md:grid-cols-2 gap-4"
					onSubmit={handleFormSubmitRequest}
					resetForm={resetResponseForm}
					setResetForm={setResetResponseForm}
					initialValues={initialData}
					editMode={
						editingId
							? { type: "single", onCancel: handleCancelEdit }
							: { type: "none" }
					}
					submitLabel={editingId ? "Guardar Cambios" : "Enviar Reporte"}
				/>
			)}

			<AlertDialogCustom
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				message="Confirmar envío"
				description={`Estás a punto de enviar el formulario para el registro de Egresados. Revisa que los datos sean correctos antes de continuar.`}
				actionLabel="Enviar Reporte"
				cancelLabel="Revisar de nuevo"
				onConfirm={confirmSubmit}
				onCancel={cancelSubmit}
			/>
		</div>
	);
}
