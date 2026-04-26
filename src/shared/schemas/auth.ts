import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria"),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
