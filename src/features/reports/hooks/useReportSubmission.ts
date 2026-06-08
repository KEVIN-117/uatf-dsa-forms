import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import { useMarkStepCompleted } from "#/features/reports/hooks/useDirectorProgress";
import { Toast } from "#/shared/components/Toast";
import {
	useDeleteFormResponse,
	useSubmitFormResponse,
	useUpdateFormResponse,
} from "#/shared/hooks/useFormResponses";
import type {
	FormModules,
	FormResponseDef,
	FormTemplateDef,
} from "#/shared/types/dynamic-form";
import { useGetNextTemplateUrl } from "./useNextFormRoute";

export const useReportSubmission = (
	formId: string,
	template?: FormTemplateDef,
) => {
	const { mutateAsync } = useSubmitFormResponse();
	const { mutateAsync: markStepCompleted } = useMarkStepCompleted();
	const { user, faculty, facultyId, program, programId } = useAuth();
	const [resetForm, setResetForm] = useState(false);
	const navigate = useNavigate();
	const nextUrl = useGetNextTemplateUrl(formId);
	const [scrollToTop, setScrollToTop] = useState(false);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [pendingData, setPendingData] = useState<{
		data: Record<string, unknown>;
		module: string;
	} | null>(null);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [initialData, setInitialData] = useState<Record<string, any> | null>(
		null,
	);

	const updateMutation = useUpdateFormResponse();
	const deleteMutation = useDeleteFormResponse();

	// Auto-scroll to top when entering edit mode (triggered by handleEdit)
	useEffect(() => {
		if (scrollToTop && editingId) {
			const element = document.getElementById("page-top");
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "start" });
			}
			setScrollToTop(false);
		}
	}, [scrollToTop, editingId]);

	// 2. FUNCTIONS AND LOGIC

	const handleEdit = (response: FormResponseDef) => {
		setEditingId(response.id);
		setInitialData(response.response);
		setScrollToTop(true);
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setInitialData(null);
		setResetForm(true);
	};

	const handleDelete = async (id: string) => {
		if (
			window.confirm(
				"¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.",
			)
		) {
			try {
				await deleteMutation.mutateAsync({
					module: template?.module as FormModules,
					id: id,
				});
			} catch {
				Toast({
					type: "error",
					title: "Error al eliminar",
					message: "No se pudo eliminar el registro. Inténtalo nuevamente.",
				});
			}
		}
	};

	const handleFormSubmitRequest = async (
		data: Record<string, unknown>,
		module: string,
	) => {
		setPendingData({ data, module });
		setIsDialogOpen(true);
	};

	const executeSubmit = async () => {
		if (!pendingData || !template || !user) return;

		const { data, module } = pendingData;
		try {
			const transformedData = Object.entries(data).reduce(
				(acc, [key, value]) => {
					const [_id, name] = key.split("@");
					acc[name || key] = value;
					return acc;
				},
				{} as Record<string, unknown>,
			);

			if (!template) {
				throw new Error("Template no encontrado");
			}
			if (!user) {
				throw new Error("Profile no encontrado");
			}
			if (editingId) {
				await updateMutation.mutateAsync({
					id: editingId,
					module: module as FormModules,
					response: transformedData,
				});
				// Limpiar estado de edición y resetear formulario
				setEditingId(null);
				setInitialData(null);
				setResetForm(true);
				setPendingData(null);
				Toast({
					title: "Registro actualizado",
					type: "success",
					duration: 5000,
					position: "top-right",
					message: "El registro ha sido actualizado correctamente.",
				});
			} else {
				await mutateAsync({
					id: crypto.randomUUID(),
					templateId: template?.id,
					module: module as FormModules,
					submittedBy: user?.email || "Director",
					createdAt: Date.now(),
					facultyId: facultyId as string,
					faculty: faculty as string,
					programId: programId as string,
					program: program as string,
					response: transformedData,
				});
				await markStepCompleted(template.step);
				Toast({
					title: "Reporte guardado exitosamente",
					type: "success",
					duration: 5000,
					position: "top-right",
					message: `El reporte ha sido guardado correctamente. ${user.displayName}`,
				});
				setResetForm(true);
				setPendingData(null);
				if (nextUrl) {
					navigate({ to: nextUrl, replace: true });
				} else {
					Toast({
						title: "¡Proceso Completado!",
						type: "success",
						message: "Has finalizado todos los formularios requeridos.",
					});
					navigate({
						to: "/formStatus/success",
						search: { completed: true },
						replace: true,
					});
				}
			}
		} catch (error: unknown) {
			Toast({
				title: "Error",
				type: "error",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message: error instanceof Error ? error.message : "Error desconocido",
			});
		}
	};

	const confirmSubmit = () => {
		setIsDialogOpen(false);
		executeSubmit();
		setPendingData(null);
	};

	const cancelSubmit = () => {
		setIsDialogOpen(false);
		setPendingData(null);
		Toast({
			title: "Reporte cancelado",
			type: "warning",
			duration: 5000,
			closeButton: true,
			position: "top-right",
			message: `El envío del reporte ha sido cancelado por ${user?.displayName}.`,
		});
	};

	return {
		isDialogOpen,
		setIsDialogOpen,
		pendingData,
		handleFormSubmitRequest,
		confirmSubmit,
		cancelSubmit,
		resetForm,
		setResetForm,
		initialData,
		editingId,
		setInitialData,
		setEditingId,
		handleDelete,
		handleEdit,
		handleCancelEdit,
		deleteMutation,
		updateMutation,
	};
};
