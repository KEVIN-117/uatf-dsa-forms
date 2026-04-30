export type FieldType = "text" | "number" | "email" | "select" | "password";

export interface FieldOption {
  label: string;
  value: string | number;
}

export interface FormFieldDef {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  dependsOn?: string[];
}

export enum FormModules {
  student = "student",
  teacher = "teacher",
  graduate = "graduate",
  scholarships = "scholarships",
}

export interface FormTemplateDef {
  id: string;
  title: string;
  description?: string;
  module: FormModules;
  step: number;
  isActive: boolean;
  fields: FormFieldDef[];
}

export interface FormResponseDef {
  id: string;
  templateId: string;
  module: FormModules;
  submittedBy: string;
  createdAt: number; //unix timestamp
  response: Record<string, any>;
}

export interface DirectorProgressDef {
  completedSteps: number[];
  updatedAt: number;
}
