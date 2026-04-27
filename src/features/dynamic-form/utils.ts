import {
  FormModules,
  type FieldOption,
  type FieldType,
  type FormFieldDef,
  type FormTemplateDef,
} from "#/shared/types/dynamic-form";

const moduleOptions: Array<{ label: string; value: FormModules }> = [
  { label: "Student", value: FormModules.student },
  { label: "Teacher", value: FormModules.teacher },
  { label: "Graduate", value: FormModules.graduate },
  { label: "Scholarships", value: FormModules.scholarships },
];

const fieldTypeOptions: Array<{ label: string; value: FieldType }> = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Email", value: "email" },
  { label: "Password", value: "password" },
  { label: "Select", value: "select" },
];

// Estilos predefinidos para inyectar en Sonner garantizando los colores requeridos
const toastStyles = {
  success: {
    backgroundColor: "#22c55e",
    color: "#ffffff",
    border: "1px solid #16a34a",
  }, // Verde
  error: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    border: "1px solid #dc2626",
  }, // Rojo
  warning: {
    backgroundColor: "#eab308",
    color: "#ffffff",
    border: "1px solid #ca8a04",
  }, // Amarillo
};

function createBlankTemplate(): FormTemplateDef {
  return {
    id: crypto.randomUUID(),
    title: "Nueva plantilla",
    description: "Describe el formulario aqui.",
    module: FormModules.student,
    isActive: true,
    fields: [createDefaultField(1)],
  };
}

function createDefaultField(index: number): FormFieldDef {
  return {
    id: `${index}`,
    label: `Campo ${index}`,
    type: "text",
    placeholder: "",
    required: true,
  };
}

function normalizeTemplate(template: FormTemplateDef): FormTemplateDef {
  return {
    ...template,
    description: template.description ?? "",
    fields: template.fields.map((field) => normalizeField(field)),
  };
}

function normalizeField(field: FormFieldDef): FormFieldDef {
  return {
    ...field,
    placeholder: field.placeholder ?? "",
    dependsOn: field.dependsOn ?? [],
    options: field.type === "select" ? (field.options ?? []) : undefined,
  };
}

function serializeOptions(options: FieldOption[]) {
  return options
    .map((option) => `${option.label} | ${option.value}`)
    .join("\n");
}

function parseOptions(value: string): FieldOption[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [labelPart, ...rest] = line.split("|");
      const label = labelPart.trim();
      const rawValue = rest.length > 0 ? rest.join("|").trim() : label;
      const numericValue = Number(rawValue);

      return {
        label,
        value:
          Number.isFinite(numericValue) && rawValue !== ""
            ? numericValue
            : rawValue,
      };
    });
}

function generateTemplateId(seed: string) {
  const base = seed
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${base || "template"}_${Date.now().toString(36)}`;
}

export {
  moduleOptions,
  fieldTypeOptions,
  toastStyles,
  createBlankTemplate,
  createDefaultField,
  normalizeTemplate,
  normalizeField,
  serializeOptions,
  parseOptions,
  generateTemplateId,
};
