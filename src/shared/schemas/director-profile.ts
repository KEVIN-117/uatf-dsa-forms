import { z } from "zod";

export const directorProfileFormSchema = z.object({
  ci: z
    .string()
    .trim()
    .min(1, "El CI es obligatorio")
    .max(150, "El CI debe tener menos de 150 caracteres"),
});

export const directorProfileSchema = directorProfileFormSchema.extend({
  facultyName: z.string().min(1),
  programName: z.string().min(1),
  savedAt: z.string().min(1),
});

export type DirectorProfileFormValues = z.infer<
  typeof directorProfileFormSchema
>;
export type DirectorProfile = z.infer<typeof directorProfileSchema>;
