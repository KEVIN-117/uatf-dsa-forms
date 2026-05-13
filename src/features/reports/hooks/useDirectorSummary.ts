import { useQuery } from "@tanstack/react-query";
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

/**
 * Fetches all responses submitted by the current director (by email)
 * across all modules, grouped by template.
 *
 * Single responsibility: response aggregation only.
 * For director profile data, use `useDirectorProfile`.
 */
export function useDirectorSummary() {
  const { user } = useAuth();
  const { data: templates, isPending: isTemplatesPending } = useFormTemplates();
  const email = user?.email ?? "";

  const responsesQuery = useQuery({
    queryKey: ["director-responses", email],
    queryFn: async () => {
      const allModules = Object.values(FormModules);

      const results = await Promise.all(
        allModules.map(async (module) => {
          // Only filter by submittedBy — no orderBy to avoid requiring a composite index
          const q = query(
            collection(db, module),
            where("submittedBy", "==", email),
          );
          const snapshot = await getDocs(q);
          return snapshot.docs.map((doc) => doc.data() as FormResponseDef);
        }),
      );

      // Sort in-memory by createdAt ascending (oldest first)
      return results.flat().sort((a, b) => a.createdAt - b.createdAt);
    },
    enabled: !!email,
  });

  const grouped = useMemo<TemplateSummary[]>(() => {
    if (!templates || !responsesQuery.data) return [];

    // Group responses by templateId
    const responseMap = new Map<string, FormResponseDef[]>();
    for (const response of responsesQuery.data) {
      const existing = responseMap.get(response.templateId) ?? [];
      existing.push(response);
      responseMap.set(response.templateId, existing);
    }

    // Match templates that have responses, sorted by step
    return templates
      .filter((t) => responseMap.has(t.id))
      .sort((a, b) => a.step - b.step)
      .map((template) => ({
        template,
        responses: responseMap.get(template.id) ?? [],
      }));
  }, [templates, responsesQuery.data]);

  return {
    data: grouped,
    isPending: isTemplatesPending || responsesQuery.isPending,
    isError: responsesQuery.isError,
    error: responsesQuery.error,
  };
}
