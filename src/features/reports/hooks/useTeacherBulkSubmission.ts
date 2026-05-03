import { useAuth } from "#/features/auth/providers/AuthProvider";
import { useToast } from "#/shared/components/Toast";
import { useMarkStepCompleted } from "#/shared/hooks/useDirectorProgress";
import { useSubmitFormResponse } from "#/shared/hooks/useFormResponses";
import { useGetNextTemplateUrl } from "#/shared/hooks/useNextFormRoute";
import type { FormTemplateDef } from "#/shared/types/dynamic-form";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

export const useTeacherBulkSubmission = (
  formId: string,
  baseCols: ColumnDef<Record<string, unknown>, any>[],
  template?: FormTemplateDef,
) => {
  const { mutateAsync } = useSubmitFormResponse();
  const { mutateAsync: markStepCompleted } = useMarkStepCompleted();
  const { user } = useAuth();
  const navigate = useNavigate();
  const nextUrl = useGetNextTemplateUrl(formId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teachers, setTeachers] = useState<Record<string, unknown>[]>([]);

  const columns = useMemo<ColumnDef<Record<string, unknown>, any>[]>(() => {
    if (!template) return [];

    const baseColumns: ColumnDef<Record<string, unknown>, any>[] = baseCols;

    const dynamicColumns: ColumnDef<Record<string, unknown>, any>[] =
      template.fields.map((field) => ({
        accessorFn: (row: any) => row[field.name],
        id: field.id,
        header: field.label,
        cell: (info) => {
          const val = info.getValue();
          if (typeof val === "boolean") return val ? "Sí" : "No";
          return val || "-";
        },
      }));

    return [...baseColumns, ...dynamicColumns];
  }, [template]);

  const handleAddTeacherToMemory = async (data: Record<string, unknown>) => {
    const transformedData = Object.entries(data).reduce(
      (acc, [key, value]) => {
        const [_id, name] = key.split("@");
        acc[name] = value;
        return acc;
      },
      {} as Record<string, unknown>,
    );

    const teacherRecord = {
      ...transformedData,
      submittedBy: user?.displayName || "Director",
      createdAt: Date.now(),
    };

    setTeachers((prev) => [...prev, teacherRecord]);

    useToast({
      title: "Docente agregado",
      type: "success",
      message:
        "El docente fue agregado a la tabla temporal. No olvides enviar los datos al finalizar.",
    });
  };

  const executeSubmitBulk = async () => {
    if (teachers.length === 0 || !template || !user) return;

    try {
      if (!template) {
        throw new Error("Template no encontrado");
      }
      if (!user) {
        throw new Error("Profile no encontrado");
      }
      const uploadPromises = teachers.map(async (t) => {
        const { submittedBy, createdAt, ...pureResponseData } = t;
        await mutateAsync({
          id: crypto.randomUUID(),
          templateId: template.id,
          module: template.module,
          submittedBy: submittedBy as string,
          createdAt: createdAt as number,
          response: pureResponseData,
        });
      });
      await Promise.all(uploadPromises);

      await markStepCompleted(template.step);

      useToast({
        title: "Reporte guardado exitosamente",
        type: "success",
        duration: 5000,
        position: "top-right",
        message: `Se registraron ${teachers.length} docentes correctamente.`,
      });
      setTeachers([]);
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
  return {
    columns,
    teachers,
    handleAddTeacherToMemory,
    executeSubmitBulk,
    isDialogOpen,
    setIsDialogOpen,
  };
};
