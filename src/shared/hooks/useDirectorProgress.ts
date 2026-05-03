import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { DirectorProgressDef } from "../types/dynamic-form";
import { useAuth } from "#/features/auth/providers/AuthProvider";

export const useDirectorProgress = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["directorProgress"],
    queryFn: async () => {
      if (!user) {
        throw new Error("No se encontro el perfil del director");
      }
      const progressRef = doc(db, "director_progress", `${user.email}`);
      const docSanp = await getDoc(progressRef);
      if (docSanp.exists()) {
        return docSanp.data() as DirectorProgressDef;
      }

      return {
        completedSteps: [],
        updatedAt: 0,
      } as DirectorProgressDef;
    },
    enabled: !!user,
  });
};

export const useMarkStepCompleted = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (step: number) => {
      if (!user) {
        throw new Error("No se encontro el perfil del director");
      }

      const progressRef = doc(db, "director_progress", `${user.email}`);

      await setDoc(
        progressRef,
        {
          completedSteps: arrayUnion(step),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      return step;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["directorProgress"] });
    },
  });
};
