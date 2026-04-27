import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db } from "#/shared/lib/firebase";
import { FormModules, type FormResponseDef } from "../types/dynamic-form";
import { toast } from "sonner";
import { useMemo } from "react";

export function useSubmitFormResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (response: FormResponseDef) => {
      const collectionRef = collection(db, response.module);
      const newDocRef = doc(collectionRef);
      const responseToSave = {
        ...response,
        id: newDocRef.id,
        createdAt: Date.now(),
      };

      await setDoc(newDocRef, responseToSave);
      return responseToSave;
    },
    onSuccess: (_data, variables) => {
      // Invalidamos las queries del módulo afectado para refrescar la tabla
      queryClient.invalidateQueries({
        queryKey: ["responses", variables.module],
      });
      toast.success("Respuesta enviada correctamente");
    },
    onError: (error) => {
      toast.error("Error al enviar la respuesta", {
        description: error.message,
      });
    },
  });
}

export function useGetResponses(module: FormModules, templateId: string) {
  return useQuery({
    queryKey: ["responses", module, templateId],
    queryFn: async () => {
      const q = query(
        collection(db, module),
        where("templateId", "==", templateId),
      );

      const snapshot = await getDocs(q);
      const responses: FormResponseDef[] = [];
      snapshot.forEach((doc) => {
        responses.push(doc.data() as FormResponseDef);
      });
      return responses.sort((a, b) => b.createdAt - a.createdAt);
    },
    enabled: !!module && !!templateId,
  });
}

export function useResponsesByModule(module: FormModules) {
  return useQuery({
    queryKey: ["responses", module],
    queryFn: async () => {
      const q = query(collection(db, module), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data() as FormResponseDef);
    },
    enabled: !!module,
  });
}

const ALL_MODULES = Object.values(FormModules);

export const useAllResponses = () => {
  return useQuery({
    queryKey: ["responses", "all"],
    queryFn: async () => {
      const results = await Promise.all(
        ALL_MODULES.map(async (mod) => {
          const q = query(collection(db, mod), orderBy("createdAt", "desc"));
          const snapshot = await getDocs(q);
          return snapshot.docs.map((doc) => doc.data() as FormResponseDef);
        }),
      );
      return results.flat();
    },
  });
};

export const getResponsesById = (id: string, module: FormModules) => {
  return useQuery({
    queryKey: ["responses", "by-id", id],
    queryFn: async () => {
      const snapshot = await getDoc(doc(db, module, id));
      return snapshot.data() as FormResponseDef;
    },
  });
};

export const useFormResponsesByModule = (module: string) => {
  const allQuery = useAllResponses();
  const responses = useMemo(
    () => allQuery.data?.filter((r) => r.module === module) ?? [],
    [allQuery.data, module],
  );
  return { ...allQuery, responses };
};

export const useFormResponseByModuleAndId = (module: string, id: string) => {
  const allQuery = useAllResponses();
  const response = useMemo(
    () => allQuery.data?.find((r) => r.module === module && r.id === id),
    [allQuery.data, module, id],
  );
  return { ...allQuery, response };
};
