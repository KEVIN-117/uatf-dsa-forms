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
import type { Faculty } from "#/shared/types";

export const useFaculties = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const q = query(collection(db, "faculties"), orderBy("id", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const faculties = snapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as Faculty[];

        queryClient.setQueryData(["faculties"], faculties);
      },
      (error) => {
        console.error("Error escuchando facultades:", error);
      },
    );

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ["faculties"],
    queryFn: () => (queryClient.getQueryData(["faculties"]) as Faculty[]) || [],
    staleTime: Infinity,
  });
};

export const useFacultiesById = (facultyId: string) => {
  const faculties = useFaculties();

  return faculties.data?.find((faculty) => faculty.id === facultyId);
};

export const useAddFaculty = () => {
  return useMutation({
    mutationFn: async (newFaculty: Omit<Faculty, "docId" | "createdAt">) => {
      const facultiesRef = collection(db, "faculties");
      return await addDoc(facultiesRef, {
        ...newFaculty,
        createdAt: serverTimestamp(),
      });
    },
  });
};

