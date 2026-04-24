import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import z from "zod";
import { auth } from "#/lib/firebase";

export const useLoginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z
    .string()
    .min(6, "Debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[a-z]/, "Debe tener al menos una minúscula")
    .regex(/[0-9]/, "Debe tener al menos un número")
    .regex(/[!@#$%^&*()]/, "Debe tener al menos un caracter especial"),
});

export type LoginSchema = z.infer<typeof useLoginSchema>;

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: LoginSchema) =>
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
