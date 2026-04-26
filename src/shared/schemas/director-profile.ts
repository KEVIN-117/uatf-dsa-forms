import { z } from "zod";

export const directorProfileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre debe tener menos de 150 caracteres"),
  facultyId: z
    .string()
    .trim()
    .min(1, "La facultad es obligatoria"),
  programId: z
    .string()
    .trim()
    .min(1, "La carrera es obligatoria"),
});

export const directorProfileSchema = directorProfileFormSchema.extend({
  facultyName: z.string().min(1),
  programName: z.string().min(1),
  savedAt: z.string().min(1),
});

export type DirectorProfileFormValues = z.infer<typeof directorProfileFormSchema>;
export type DirectorProfile = z.infer<typeof directorProfileSchema>;
