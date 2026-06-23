import type { Timestamp } from "firebase/firestore";

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
	defaultValue?: string | number | boolean | null;
}

export enum FormModules {
	student = "student",
	teacher = "teacher",
	graduate = "graduate",
	scholarships = "scholarships",
}

export interface FormTemplateDef {
	id: string;
	periodId: string;
	title: string;
	shortTitle: string;
	description?: string;
	module: FormModules;
	step: number;
	isActive: boolean;
	fields: FormFieldDef[];
	hasBulk: boolean;
}

export interface FormResponseDef {
	id: string;
	templateId: string;
	periodId: string;
	module: FormModules;
	submittedBy: string;
	facultyId: string;
	programId: string;
	faculty: string;
	program: string;
	createdAt: number; //unix timestamp
	response: Record<string, any>;
}

export interface DirectorProgressDef {
	completedSteps: number[];
	periodId: string;
	updatedAt: Timestamp;
}
