import { useQueries } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "#/shared/lib/firebase";
import {
  FormModules,
  type FormResponseDef,
  type FormTemplateDef,
} from "#/shared/types/dynamic-form";
import { useFormTemplates } from "#/shared/hooks/useFormBuilder";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import { useMemo } from "react";

export interface TemplateSummary {
  template: FormTemplateDef;
  responses: FormResponseDef[];
}

const ALL_MODULES = Object.values(FormModules);

/** 5 minutes — receipt data doesn't change often once submitted */
const STALE_TIME = 5 * 60 * 1000;

export function useDirectorSummary() {
  const { user } = useAuth();
  const { data: templates, isPending: isTemplatesPending } = useFormTemplates();
  const email = user?.email ?? "";

  const moduleQueries = useQueries({
    queries: ALL_MODULES.map((module) => ({
      queryKey: ["responses", module, "by-email", email],
      queryFn: async () => {
        const q = query(
          collection(db, module),
          where("submittedBy", "==", email),
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => d.data() as FormResponseDef);
      },
      enabled: !!email,
      staleTime: STALE_TIME,
    })),
  });

  const isPending = isTemplatesPending || moduleQueries.some((q) => q.isPending);
  const isError = moduleQueries.every((q) => q.isError);
  const error = moduleQueries.find((q) => q.error)?.error ?? null;

  const allResponses = useMemo(() => {
    return moduleQueries
      .filter((q) => q.status === "success" && q.data)
      .flatMap((q) => q.data!)
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [moduleQueries]);

  const grouped = useMemo<TemplateSummary[]>(() => {
    if (!templates || allResponses.length === 0) return [];

    const responseMap = new Map<string, FormResponseDef[]>();
    for (const response of allResponses) {
      const existing = responseMap.get(response.templateId) ?? [];
      existing.push(response);
      responseMap.set(response.templateId, existing);
    }

    return templates
      .filter((t) => responseMap.has(t.id))
      .sort((a, b) => a.step - b.step)
      .map((template) => ({
        template,
        responses: responseMap.get(template.id) ?? [],
      }));
  }, [templates, allResponses]);

  return {
    data: grouped,
    isPending,
    isError,
    error,
  };
}
