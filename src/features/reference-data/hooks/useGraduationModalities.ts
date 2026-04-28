import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "#/shared/lib/firebase";
import type { GraduationModality } from "#/shared/types";

export const useGraduationModalities = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const q = query(
      collection(db, "graduation_modalities"),
      orderBy("id", "asc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const modalities = snapshot.docs.map((docSnap) => ({
          docId: docSnap.id,
          ...docSnap.data(),
        })) as GraduationModality[];

        queryClient.setQueryData(["graduation_modalities"], modalities);
      },
      (error) => {
        console.error("Error escuchando modalidades de graduación:", error);
      },
    );

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ["graduation_modalities"],
    queryFn: () =>
      (queryClient.getQueryData(["graduation_modalities"]) as GraduationModality[]) || [],
    staleTime: Infinity,
  });
};

export const useAddGraduationModality = () => {
  return useMutation({
    mutationFn: async (newModality: Omit<GraduationModality, "docId">) => {
      const ref = collection(db, "graduation_modalities");
      return await addDoc(ref, {
        ...newModality,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
  });
};

export const useUpdateGraduationModality = () => {
  return useMutation({
    mutationFn: async ({ docId, ...data }: GraduationModality) => {
      const docRef = doc(db, "graduation_modalities", docId);
      return await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
  });
};

export const useDeleteGraduationModality = () => {
  return useMutation({
    mutationFn: async (docId: string) => {
      const docRef = doc(db, "graduation_modalities", docId);
      return await deleteDoc(docRef);
    },
  });
};
