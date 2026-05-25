import { useAuth } from "#/features/auth/providers/AuthProvider";
import { Toast } from "#/shared/components/Toast";
import { useMarkStepCompleted } from "#/features/reports/hooks/useDirectorProgress";
import { useSubmitFormResponse } from "#/shared/hooks/useFormResponses";
import type { FormTemplateDef } from "#/shared/types/dynamic-form";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { useGetNextTemplateUrl } from "./useNextFormRoute";

export const useBulkSubmission = (
  formId: string,
  baseCols: ColumnDef<Record<string, unknown>, any>[],
  template?: FormTemplateDef,
) => {
  const { mutateAsync } = useSubmitFormResponse();
  const { mutateAsync: markStepCompleted } = useMarkStepCompleted();
  const { user, faculty, facultyId, program, programId } = useAuth();

  const navigate = useNavigate();
  const nextUrl = useGetNextTemplateUrl(formId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [resetForm, setResetForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [initialValues, setInitialValues] = useState<Record<
    string,
    unknown
  > | null>(null);

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

    return [...dynamicColumns, ...baseColumns];
  }, [template, baseCols]);

  /** Remove a row from the in-memory table by index */
  const removeData = useCallback(
    (index: number) => {
      setData((prev) => prev.filter((_, i) => i !== index));

      // If we were editing this row, cancel the edit
      if (editingIndex === index) {
        setEditingIndex(null);
        setInitialValues(null);
        setResetForm(true);
      } else if (editingIndex !== null && index < editingIndex) {
        // Adjust editing index if a row before it was removed
        setEditingIndex((prev) => (prev !== null ? prev - 1 : null));
      }

      Toast({
        title: "Registro eliminado",
        type: "warning",
        message: "El registro fue eliminado de la tabla temporal.",
      });
    },
    [editingIndex],
  );

  /** Load a row's data back into the form for editing */
  const editData = useCallback(
    (index: number) => {
      if (!template) return;

      const row = data[index];
      if (!row) return;

      // Transform row data (keyed by field.name) back to form keys (field.id@field.name)
      const formValues: Record<string, unknown> = {};
      for (const field of template.fields) {
        const key = `${field.id}@${field.name}`;
        formValues[key] = row[field.name] ?? "";
      }

      setEditingIndex(index);
      setInitialValues(formValues);
    },
    [data, template],
  );

  /** Cancel editing and clear the form */
  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setInitialValues(null);
    setResetForm(true);
  }, []);

  const handleAddDataToMemory = async (data: Record<string, unknown>) => {
    const transformedData = Object.entries(data).reduce(
      (acc, [key, value]) => {
        const [_id, name] = key.split("@");
        acc[name] = value;
        return acc;
      },
      {} as Record<string, unknown>,
    );

    const record = {
      ...transformedData,
      submittedBy: user?.email || "director@uatf.edu.bo",
      createdAt: Date.now(),
    };

    if (editingIndex !== null) {
      // Update the existing row
      setData((prev) =>
        prev.map((item, i) => (i === editingIndex ? record : item)),
      );
      setEditingIndex(null);
      setInitialValues(null);

      Toast({
        title: "Registro actualizado",
        type: "success",
        message:
          "El registro fue actualizado correctamente en la tabla temporal.",
      });
    } else {
      // Add a new row
      setData((prev) => [...prev, record]);

      Toast({
        title: "Dato agregado",
        type: "success",
        message:
          "El dato fue agregado a la tabla temporal. No olvides enviar los datos al finalizar.",
      });
    }

    setResetForm(true);
  };

  const executeSubmitBulk = async () => {
    if (data.length === 0 || !template || !user) return;

    try {
      if (!template) {
        throw new Error("Template no encontrado");
      }
      if (!user) {
        throw new Error("Profile no encontrado");
      }
      const uploadPromises = data.map(async (r) => {
        const { submittedBy, createdAt, ...pureResponseData } = r;
        await mutateAsync({
          id: crypto.randomUUID(),
          templateId: template.id,
          module: template.module,
          submittedBy: submittedBy as string,
          createdAt: createdAt as number,
          facultyId: facultyId as string,
          faculty: faculty as string,
          programId: programId as string,
          program: program as string,
          response: pureResponseData,
        });
      });
      await Promise.all(uploadPromises);

      await markStepCompleted(template.step);

      setResetForm(true);
      Toast({
        title: "Reporte guardado exitosamente",
        type: "success",
        duration: 5000,
        position: "top-right",
        message: `Se registraron ${data.length} registros correctamente.`,
      });
      setData([]);
      if (nextUrl) {
        navigate({ to: nextUrl, replace: true });
      } else {
        Toast({
          title: "¡Proceso Completado!",
          type: "success",
          message: "Has finalizado todos los formularios requeridos.",
        });
        navigate({ to: "/formStatus/success", search: { completed: true }, replace: true });
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
  return {
    columns,
    data,
    handleAddDataToMemory,
    executeSubmitBulk,
    isDialogOpen,
    setIsDialogOpen,
    resetForm,
    setResetForm,
    removeData,
    editData,
    cancelEdit,
    editingIndex,
    initialValues,
  };
};
