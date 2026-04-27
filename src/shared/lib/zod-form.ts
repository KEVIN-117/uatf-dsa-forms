import type { z } from "zod";

export function validateSchemaField<
  TShape extends z.ZodRawShape,
  TField extends Extract<keyof TShape, string>,
>(
  schema: z.ZodObject<TShape>,
  field: TField,
  value: unknown,
) {
  const result = schema.shape[field].safeParse(value);

  if (result.success) {
    return undefined;
  }

  return result.error.issues[0]?.message ?? "Valor inválido";
}
