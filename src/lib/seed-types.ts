export interface Modality {
	id: string;
	modality: string;
	code: string;
}

export interface ScholarshipsType {
	docId: string;
	id: string;
	name: string;
}

export interface AcademicLevel {
	docId: string;
	id: string;
	name: string;
	code: string;
}

export interface GraduationModality {
	id: string;
	name: string;
	code: string;
}

export interface Workload {
	docId: string;
	id: string;
	name: string;
	code: string;
}

export interface TeachingCategory {
	docId: string;
	id: string;
	name: string;
	code: string;
}

export interface DirectorSeedRaw {
	email: string;
	name: string;
	ci: string | number;
	paternalSurname: string;
	maternalSurname: string;
	facultyId: string | null;
	programId: string;
	faculty: string | null;
	program: string;
}
