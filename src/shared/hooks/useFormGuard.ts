import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useFormTemplates } from "#/shared/hooks/useFormBuilder";
import { useDirectorProgress } from "#/shared/hooks/useDirectorProgress";
import type { FormTemplateDef } from "#/shared/types/dynamic-form";

export const useFormGuard = (currentTemplate: FormTemplateDef | undefined) => {
  const navigate = useNavigate();
  const { data: allTemplates, isPending: isTemplatesPending } =
    useFormTemplates();
  const { data: progress, isPending: isProgressPending } =
    useDirectorProgress();

  useEffect(() => {
    if (
      isTemplatesPending ||
      isProgressPending ||
      !currentTemplate ||
      !allTemplates ||
      !progress
    ) {
      return; // Esperamos a que todo cargue
    }

    const completedSteps = progress.completedSteps || [];

    // Calculamos el paso actual permitido (igual que en el menú)
    const sortedTemplates = [...allTemplates].sort((a, b) => a.step - b.step);
    const nextAvailable = sortedTemplates.find(
      (t) => !completedSteps.includes(t.step),
    );
    const currentActiveStep = nextAvailable ? nextAvailable.step : Infinity;

    // Si el formulario actual tiene un paso MAYOR al permitido, lo expulsamos
    if (currentTemplate.step > currentActiveStep) {
      // Redirigir al inicio del Dashboard o al paso que le toca realmente
      navigate({
        to: "/dashboard/dashboard", // Redirigimos a un lugar seguro
        replace: true, // Reemplazamos el historial para que el botón "Atrás" no lo regrese aquí
      });
    }
  }, [
    currentTemplate,
    allTemplates,
    progress,
    isTemplatesPending,
    isProgressPending,
    navigate,
  ]);
};
