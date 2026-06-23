import { notFound } from "@tanstack/react-router";
import { DollarSignIcon } from "lucide-react";
import { usePeriodState } from "#/app/providers/period-provider";
import { AlertDialogCustom } from "#/shared/components/Dialog";
import { DynamicForm } from "#/shared/components/DynamicForm";
import { DynamicReportPageSkeleton } from "#/shared/components/DynamicReportPageSkeleton";
import { DynamicReportPageState } from "#/shared/components/DynamicReportPageState";
import { PageHeader } from "#/shared/components/PageHeader";
import { useFormTemplateByModuleAndId } from "#/shared/hooks/useFormBuilder";
import { useReportSubmission } from "./hooks/useReportSubmission";
import { useSubmittedTotals } from "./hooks/useSubmittedModalidades";

interface ScholarshipReportProps {
	formId: string;
	isEmbedded?: boolean;
	onSuccess?: () => void;
}

export function ScholarshipReport({
	formId,
	isEmbedded = false,
	onSuccess,
}: ScholarshipReportProps) {
	// 1. HOOK ZONE
	const { isReadOnly } = usePeriodState();
	const { template, isPending, isError, error } = useFormTemplateByModuleAndId(
		"scholarships",
		formId,
	);
	const {
		handleFormSubmitRequest,
		cancelSubmit,
		confirmSubmit,
		initialData,
		editingId,
		handleCancelEdit,
		isDialogOpen: isConfirmDialogOpen,
		setIsDialogOpen: setIsConfirmDialogOpen,
		resetForm: resetResponseForm,
		setResetForm: setResetResponseForm,
	} = useReportSubmission(formId, template, onSuccess);

	const { data: crossStepLimits } = useSubmittedTotals("3", "student");

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
						icon={DollarSignIcon}
						title={`Formulario: ${template.title}`}
						description="Completa los campos requeridos para enviar el reporte."
					/>
				</>
			)}

			{!isReadOnly && (
				<DynamicForm
					key={`edit-schol-${editingId ?? "new"}`}
					template={template!}
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
					crossStepLimits={crossStepLimits}
				/>
			)}

			<AlertDialogCustom
				open={isConfirmDialogOpen}
				onOpenChange={setIsConfirmDialogOpen}
				message="Confirmar envío"
				description={`Estás a punto de enviar el formulario para el registro de Becarios. Revisa que los datos sean correctos antes de continuar.`}
				actionLabel="Enviar Reporte"
				cancelLabel="Revisar de nuevo"
				onConfirm={confirmSubmit}
				onCancel={cancelSubmit}
			/>
		</div>
	);
}
