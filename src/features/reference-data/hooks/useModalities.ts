import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "#/shared/lib/firebase";
import type { Modality } from "#/shared/types";

export const useModalities = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const q = query(collection(db, "modalities"), orderBy("id", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const modalities = snapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        })) as Modality[];

        queryClient.setQueryData(["modalities"], modalities);
      },
      (error) => {
        console.error("Error escuchando modalidades:", error);
      },
    );

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ["modalities"],
    queryFn: () =>
      (queryClient.getQueryData(["modalities"]) as Modality[]) || [],
    staleTime: Infinity,
  });
};

export const useAddModality = () => {
  return useMutation({
    mutationFn: async (newModality: Omit<Modality, "docId" | "createdAt">) => {
      const modalitiesRef = collection(db, "modalities");
      return await addDoc(modalitiesRef, {
        ...newModality,
        createdAt: serverTimestamp(),
      });
    },
  });
};

export const useModalityById = (modalityId: string) => {
  const modalities = useModalities();

  return modalities.data?.find((modality) => modality.id === modalityId);
};

