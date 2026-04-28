import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "#/shared/lib/firebase";
import type { Program } from "#/shared/types";

export const usePrograms = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const programsQuery = query(collection(db, "programs"), orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      programsQuery,
      (snapshot) => {
        const programs = snapshot.docs.map((docSnap) => ({
          docId: docSnap.id,
          ...docSnap.data(),
        })) as Program[];
        queryClient.setQueryData(["programs"], programs);
      },
      (error) => {
        console.error("Error escuchando programas:", error);
      },
    );

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ["programs"],
    queryFn: () => (queryClient.getQueryData(["programs"]) as Program[]) || [],
    staleTime: Infinity,
  });
};

export const useProgramsByFaculty = (facultyId: string) => {
  const programs = usePrograms();

  return (
    programs.data?.filter((program) => program.facultyId === facultyId) ?? []
  );
};

export const useAddProgram = () => {
  return useMutation({
    mutationFn: async (newProgram: Omit<Program, "docId">) => {
      const programsRef = collection(db, "programs");

      return await addDoc(programsRef, {
        ...newProgram,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    },
  });
};

export const useUpdateProgram = () => {
  return useMutation({
    mutationFn: async ({ docId, ...data }: Program & { docId: string }) => {
      const docRef = doc(db, "programs", docId);
      return await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
  });
};

export const useDeleteProgram = () => {
  return useMutation({
    mutationFn: async (docId: string) => {
      const docRef = doc(db, "programs", docId);
      return await deleteDoc(docRef);
    },
  });
};
