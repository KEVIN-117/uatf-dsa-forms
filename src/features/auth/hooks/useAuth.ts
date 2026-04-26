import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "#/shared/lib/firebase";
import type { AdminLoginFormValues } from "#/shared/schemas/auth";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: AdminLoginFormValues) =>
      signInWithEmailAndPassword(auth, email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => signOut(auth),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

