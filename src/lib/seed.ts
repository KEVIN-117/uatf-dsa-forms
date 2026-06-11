import * as dotenv from "dotenv";
dotenv.config();

import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

const serviceAccount = JSON.parse(
	fs.readFileSync(
		path.resolve(__dirname, "../../serviceAccountKey.json"),
		"utf-8",
	),
);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

import { FormModules, type FormResponseDef } from "#/shared/types/dynamic-form";

import {
	academicLevels,
	directors,
	faculties,
	graduationModalities,
	modalities,
	programs,
	scholarshipsTypes,
	teachingAcademicLevels,
	teachingCategories,
	workloads,
} from "./seed-data";

import {
	graduateFormTemplates,
	scholarshipFormTemplates,
	studentFormTemplates,
	teacherFormTemplates,
} from "./seed-templates";

export async function seedModalities() {
	try {
		for (const item of modalities) {
			await db
				.collection("modalities")
				.doc(item.id)
				.set({
					...item,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
		}
		console.log("✅ Modalidades sembradas exitosamente");
	} catch (error) {
		console.error("❌ Error al sembrar modalidades:", error);
	}
}

export async function seedFaculties() {
	try {
		for (const item of faculties) {
			await db
				.collection("faculties")
				.doc(item.id)
				.set({
					...item,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
		}
		console.log("✅ Facultades sembradas exitosamente");
	} catch (error) {
		console.error("❌ Error al sembrar facultades:", error);
	}
}

export async function seedPrograms() {
	try {
		const batchPromises = programs.map((item) =>
			db
				.collection("programs")
				.doc(item.id)
				.set({
					...item,
					allowedGraduationModalitiesIds:
						item.allowedGraduationModalitiesIds.filter(
							(modalityId) => modalityId !== "6",
						),
					createdAt: new Date(),
					updatedAt: new Date(),
				}),
		);

		await Promise.all(batchPromises);
		console.log(`✅ ${programs.length} Programas sembrados exitosamente`);
	} catch (error) {
		console.error("❌ Error al sembrar los programas:", error);
	}
}

export async function seedScholarshipsTypes() {
	try {
		for (const item of scholarshipsTypes) {
			await db
				.collection("scholarshipsTypes")
				.doc(item.id)
				.set({
					...item,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
		}
		console.log("✅ Scholarships types sembradas exitosamente");
	} catch (error) {
		console.error("❌ Error al sembrar scholarships types:", error);
	}
}

export async function seedAcademicLevels() {
	try {
		for (const item of academicLevels) {
			await db
				.collection("academicLevels")
				.doc(item.id)
				.set({
					...item,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
		}
		console.log("✅ Academic levels sembrados exitosamente");
	} catch (error) {
		console.error("❌ Error al sembrar academic levels:", error);
	}
}

export async function seedFormFields() {
	try {
		const allTemplates = [
			...studentFormTemplates,
			...graduateFormTemplates,
			...teacherFormTemplates,
			...scholarshipFormTemplates,
		];

		const uploadPromises = allTemplates.map((item) =>
			db
				.collection("form_templates")
				.doc(item.id)
				.set({
					...item,
					createdAt: new Date(),
					updatedAt: new Date(),
				}),
		);

		await Promise.all(uploadPromises);
		console.log(
			`✅ ${allTemplates.length} Form Templates sembrados exitosamente`,
		);
	} catch (error) {
		console.error("❌ Error al sembrar los Form Templates:", error);
	}
}

export async function seedFormResponses() {
	console.log("🌱 Iniciando la siembra de respuestas de prueba...");
	const responses: FormResponseDef[] = [];

	const mockUsers = directors.length > 0
		? directors.map((d) => d.email)
		: [
			"sheylajahel.cadiz@lef.edu.bo",
			"juanvirgilio.silva@tmc.edu.bo",
			"ovidiolucio.copa@tuu.edu.bo",
			"neil.alfaro@ctt.edu.bo",
		];

	const directorMetaByEmail = new Map(
		directors.map((director) => [
			director.email.toLowerCase(),
			{
				facultyId: director.facultyId || "",
				faculty: director.faculty || "",
				programId: director.programId || "",
				program: director.program || "",
			},
		]),
	);

	for (let i = 1; i <= 200; i++) {
		const moduleType = i % 4;
		const isStudent = moduleType === 0;
		const isGraduate = moduleType === 1;
		const isTeacher = moduleType === 2;

		const masculino = Math.floor(Math.random() * 5000) + 100;
		const femenino = Math.floor(Math.random() * 5000) + 100;
		const total = masculino + femenino;

		const submittedBy = mockUsers[Math.floor(Math.random() * mockUsers.length)];
		const submitterMeta = directorMetaByEmail.get(submittedBy.toLowerCase()) ?? {
			facultyId: "",
			faculty: "",
			programId: "",
			program: "",
		};

		const createdAt =
			Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);

		if (isStudent) {
			responses.push({
				id: `mock-resp-${i}`,
				templateId: "1",
				module: FormModules.student,
				submittedBy,
				facultyId: submitterMeta.facultyId,
				faculty: submitterMeta.faculty,
				programId: submitterMeta.programId,
				program: submitterMeta.program,
				createdAt,
				response: {
					modalidad:
						modalities[Math.floor(Math.random() * modalities.length)].id,
					masculino,
					femenino,
					total,
				},
			});
		} else if (isGraduate) {
			responses.push({
				id: `mock-resp-${i}`,
				templateId: "7",
				module: FormModules.graduate,
				submittedBy,
				facultyId: submitterMeta.facultyId,
				faculty: submitterMeta.faculty,
				programId: submitterMeta.programId,
				program: submitterMeta.program,
				createdAt,
				response: {
					modalidad:
						graduationModalities[Math.floor(Math.random() * graduationModalities.length)].id,
					masculino,
					femenino,
					total,
				},
			});
		} else if (isTeacher) {
			const surnames = [
				"García",
				"López",
				"Mamani",
				"Quispe",
				"Fernández",
				"Condori",
				"Vargas",
				"Rojas",
			];
			const names = [
				"Juan",
				"María",
				"Carlos",
				"Ana",
				"Pedro",
				"Luisa",
				"José",
				"Rosa",
			];
			responses.push({
				id: `mock-resp-${i}`,
				templateId: "9",
				module: FormModules.teacher,
				submittedBy,
				facultyId: submitterMeta.facultyId,
				faculty: submitterMeta.faculty,
				programId: submitterMeta.programId,
				program: submitterMeta.program,
				createdAt,
				response: {
					paterno: surnames[Math.floor(Math.random() * surnames.length)],
					materno: surnames[Math.floor(Math.random() * surnames.length)],
					nombres: names[Math.floor(Math.random() * names.length)],
					ci: `${Math.floor(Math.random() * 9000000) + 1000000}`,
					cel: `${Math.floor(Math.random() * 9000000) + 60000000}`,
					carga_horaria: workloads[Math.floor(Math.random() * workloads.length)].id,
					categoria: teachingCategories[Math.floor(Math.random() * teachingCategories.length)].id,
					nivel_academico: teachingAcademicLevels[Math.floor(Math.random() * teachingAcademicLevels.length)].id,
					profesion: [
						"Ing. Sistemas",
						"Lic. Matemáticas",
						"Ing. Civil",
						"Lic. Física",
					][Math.floor(Math.random() * 4)],
				},
			});
		} else {
			responses.push({
				id: `mock-resp-${i}`,
				templateId: "10",
				module: FormModules.scholarships,
				submittedBy,
				facultyId: submitterMeta.facultyId,
				faculty: submitterMeta.faculty,
				programId: submitterMeta.programId,
				program: submitterMeta.program,
				createdAt,
				response: {
					tipo: ["parcial", "completa"][Math.floor(Math.random() * 2)],
					masculino,
					femenino,
					total,
				},
			});
		}
	}

	try {
		const batchSize = 50;
		for (let i = 0; i < responses.length; i += batchSize) {
			const batch = responses.slice(i, i + batchSize);
			const batchPromises = batch.map((item) =>
				db.collection(item.module).doc(item.id).set(item),
			);
			await Promise.all(batchPromises);
		}
		console.log(`✅ ${responses.length} Form Responses sembradas exitosamente`);
	} catch (error) {
		console.error("❌ Error al sembrar los Form Responses:", error);
	}
}

export async function seedGraduationModalities() {
	try {
		for (const item of graduationModalities) {
			await db
				.collection("graduation_modalities")
				.doc(item.id)
				.set({
					...item,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
		}
		console.log("✅ Modalidades de graduación sembradas exitosamente");
	} catch (error) {
		console.error("❌ Error al sembrar modalidades de graduación:", error);
	}
}

export async function seedTeachingCategories() {
	try {
		for (const item of teachingCategories) {
			await db
				.collection("teachingCategories")
				.doc(item.id)
				.set({
					...item,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
		}
		console.log("✅ Categorías de docencia sembradas exitosamente");
	} catch (error) {
		console.error("❌ Error al sembrar categorías de docencia:", error);
	}
}

export async function seedWorkloads() {
	try {
		for (const item of workloads) {
			await db
				.collection("workloads")
				.doc(item.id)
				.set({
					...item,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
		}
		console.log("✅ Cargas horarias sembradas exitosamente");
	} catch (error) {
		console.error("❌ Error al sembrar cargas horarias:", error);
	}
}

export async function seedTeachingAcademicLevels() {
	try {
		for (const item of teachingAcademicLevels) {
			await db
				.collection("teachingAcademicLevels")
				.doc(item.id)
				.set({
					...item,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
		}
		console.log("✅ Niveles académicos de docencia sembrados exitosamente");
	} catch (error) {
		console.error("❌ Error al sembrar niveles académicos de docencia:", error);
	}
}

export async function runSeed() {
	console.log("🌱 Iniciando la siembra de datos en Firestore...");

	try {
		await seedModalities();
		await seedGraduationModalities();
		await seedFaculties();
		await seedPrograms();
		await seedAcademicLevels();
		await seedTeachingCategories();
		await seedWorkloads();
		await seedTeachingAcademicLevels();
		await seedScholarshipsTypes();
		await seedFormFields();
		if (process.env.NODE_ENV === "development") {
			await seedFormResponses();
		}

		console.log("🎉 Proceso de siembra finalizado con éxito.");
		process.exit(0);
	} catch (error) {
		console.error("❌ Ocurrió un error fatal durante el seed:", error);
		process.exit(1);
	}
}

runSeed();
