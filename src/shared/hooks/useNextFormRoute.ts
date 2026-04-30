import { FormModules } from "#/shared/types/dynamic-form";
import { useMemo } from "react";
import { useFormTemplates } from "./useFormBuilder";

const MODULE_PATHS: Record<FormModules, string> = {
  [FormModules.student]: "student-report",
  [FormModules.graduate]: "graduates-report",
  [FormModules.teacher]: "teacher-report",
  [FormModules.scholarships]: "scholarship-report",
};

export const useGetNextTemplateUrl = (currentFormId: string): string | null => {
  // 1. HOOK ZONE
  const { data: allTemplates } = useFormTemplates();
  const nextUrl = useMemo(() => {
    if (!allTemplates || allTemplates.length === 0) return null;

    const sortedTemplates = [...allTemplates].sort((a, b) => a.step - b.step);

    const currentIndex = sortedTemplates.findIndex(
      (t) => t.id === currentFormId,
    );
    if (currentIndex === -1 || currentIndex === sortedTemplates.length - 1)
      return null;

    const nextTemplate = sortedTemplates[currentIndex + 1];
    const modulePath = MODULE_PATHS[nextTemplate.module];
    if (!modulePath) return null;

    return `/${modulePath}/${nextTemplate.id}`;
  }, [allTemplates, currentFormId]);

  // 2. FUNCTIONS AND LOGIC

  // 3. EARLY RETURNS
  if (!allTemplates || allTemplates.length === 0) return null;

  // 4. MAIN RENDER / RESULT
  return nextUrl;
};
