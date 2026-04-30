import { useDirectorProfile } from "#/features/director-profile/providers/DirectorProfileProvider";
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

export const useDirectorProgress = () => {
  const { profile } = useDirectorProfile();
  return useQuery({
    queryKey: ["directorProgress"],
    queryFn: async () => {
      if (!profile) {
        throw new Error("No se encontro el perfil del director");
      }
      const progressRef = doc(
        db,
        "director_progress",
        `${profile.fullName}@${profile.facultyName}@${profile.programName}`,
      );
      const docSanp = await getDoc(progressRef);
      if (docSanp.exists()) {
        return docSanp.data() as DirectorProgressDef;
      }

      return {
        completedSteps: [],
        updatedAt: 0,
      } as DirectorProgressDef;
    },
    enabled: !!profile,
  });
};

export const useMarkStepCompleted = () => {
  const queryClient = useQueryClient();
  const { profile } = useDirectorProfile();

  return useMutation({
    mutationFn: async (step: number) => {
      if (!profile) {
        throw new Error("No se encontro el perfil del director");
      }

      const progressRef = doc(
        db,
        "director_progress",
        `${profile.fullName}@${profile.facultyName}@${profile.programName}`,
      );

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
