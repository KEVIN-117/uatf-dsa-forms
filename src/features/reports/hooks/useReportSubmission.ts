import { useAuth } from "#/features/auth/providers/AuthProvider";
import { useToast } from "#/shared/components/Toast";
import { useMarkStepCompleted } from "#/features/reports/hooks/useDirectorProgress";
import { useSubmitFormResponse } from "#/shared/hooks/useFormResponses";
import type { FormModules, FormTemplateDef } from "#/shared/types/dynamic-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useGetNextTemplateUrl } from "./useNextFormRoute";

export const useReportSubmission = (
  formId: string,
  template?: FormTemplateDef,
) => {
  const { mutateAsync } = useSubmitFormResponse();
  const { mutateAsync: markStepCompleted } = useMarkStepCompleted();
  const { user, faculty, facultyId, program, programId } = useAuth();
  const navigate = useNavigate();
  const nextUrl = useGetNextTemplateUrl(formId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<{
    data: Record<string, unknown>;
    module: string;
  } | null>(null);

  // 2. FUNCTIONS AND LOGIC
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
      const tranformedData = Object.entries(data).reduce(
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
        response: tranformedData,
      });
      await markStepCompleted(template.step);

      useToast({
        title: "Reporte guardado exitosamente",
        type: "success",
        duration: 5000,
        position: "top-right",
        message: `El reporte ha sido guardado correctamente. ${user.displayName}`,
      });

      setPendingData(null);
      if (nextUrl) {
        navigate({ to: nextUrl, replace: true });
      } else {
        useToast({
          title: "¡Proceso Completado!",
          type: "success",
          message: "Has finalizado todos los formularios requeridos.",
        });
        navigate({ to: "/formStatus/success", replace: true });
      }
    } catch (error: unknown) {
      useToast({
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
    useToast({
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
  };
};
