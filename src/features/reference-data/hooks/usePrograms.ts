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
    const programsQuery = query(
      collection(db, "programs"),
      orderBy("name", "asc"),
    );

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
    programs.data?.filter((program) => program.facultyId === facultyId) || []
  );
};
export const useProgramByFaculty = (facultyId: string | null) => {
  const { data: programs } = usePrograms();

  return useQuery({
    queryKey: ["programByFaculty", facultyId, programs?.length],
    queryFn: () => {
      if (!facultyId || !programs) return null;
      return programs.find((program) => program.facultyId === facultyId) || null;
    },
    enabled: !!facultyId && !!programs && programs.length > 0,
    staleTime: Infinity,
  });
};

export const useProgramById = (programId: string | null) => {
  const { data: programs } = usePrograms();

  return useQuery({
    queryKey: ["programById", programId, programs?.length],
    queryFn: () => {
      if (!programId || !programs) return null;
      return programs.find((program) => program.id === programId) || null;
    },
    enabled: !!programId && !!programs && programs.length > 0,
    staleTime: Infinity,
  });
};

export const useAddProgram = () => {
  return useMutation({
    mutationFn: async (newProgram: Omit<Program, "docId">) => {
      // Usamos setDoc con el id manual como docId para mantener consistencia con el seed
      // y con hooks como useProgramModalities que esperan que el docId sea el id del programa.
      const docRef = doc(db, "programs", newProgram.id);

      return await setDoc(docRef, {
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
