import { db } from "#/shared/lib/firebase";
import type { Program } from "#/shared/types";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

export function useProgramModalities(programId?: string) {
  return useQuery({
    queryKey: ["program-modalities", programId],
    queryFn: async () => {
      if (!programId) return [];
      const docRef = doc(db, "programs", programId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as Program;

        return (data.allowedModalitiesIds as string[]) || [];
      }
      return [];
    },
    enabled: !!programId,
  });
}

export function useProgramGraduationModalities(programId?: string) {
  return useQuery({
    queryKey: ["program-graduation-modalities", programId],
    queryFn: async () => {
      if (!programId) return [];
      const docRef = doc(db, "programs", programId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as Program;

        return (data.allowedGraduationModalitiesIds as string[]) || [];
      }
      return [];
    },
    enabled: !!programId,
  });
}
