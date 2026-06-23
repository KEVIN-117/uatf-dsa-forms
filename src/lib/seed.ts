import * as dotenv from "dotenv";

dotenv.config({ override: true });

import * as fs from "node:fs";
import * as path from "node:path";
import * as admin from "firebase-admin";

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

import {
	FormModules,
	type FormResponseDef,
	type FormTemplateDef,
} from "#/shared/types/dynamic-form";

import {
	academicLevels,
	directors,
	faculties,
	graduationModalities,
	modalities,
	periods,
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
		const baseTemplates = [
			...studentFormTemplates,
			...graduateFormTemplates,
			...teacherFormTemplates,
			...scholarshipFormTemplates,
		];

		const allTemplates: FormTemplateDef[] = [];
		for (const item of baseTemplates) {
			// 2026 active version
			allTemplates.push({
				...item,
				id: item.id,
				periodId: "2026",
			});
			// 2025 historical version
			allTemplates.push({
				...item,
				id: `${item.id}-2025`,
				periodId: "2025",
			});
		}

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
			`✅ ${allTemplates.length} Form Templates sembrados exitosamente (2025 y 2026)`,
		);
	} catch (error) {
		console.error("❌ Error al sembrar los Form Templates:", error);
	}
}

export async function seedFormResponses() {
	console.log("🌱 Iniciando la siembra de respuestas de prueba...");
	const responses: FormResponseDef[] = [];

	const mockUsers =
		directors.length > 0
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
		const periodId = i <= 100 ? "2025" : "2026";
		const templateSuffix = periodId === "2025" ? "-2025" : "";

		const moduleType = i % 4;
		const isStudent = moduleType === 0;
		const isGraduate = moduleType === 1;
		const isTeacher = moduleType === 2;

		const masculino = Math.floor(Math.random() * 5000) + 100;
		const femenino = Math.floor(Math.random() * 5000) + 100;
		const total = masculino + femenino;

		const submittedBy = mockUsers[Math.floor(Math.random() * mockUsers.length)];
		const submitterMeta = directorMetaByEmail.get(
			submittedBy.toLowerCase(),
		) ?? {
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
				templateId: `1${templateSuffix}`,
				periodId,
				module: FormModules.student,
				submittedBy,
				facultyId: submitterMeta.facultyId,
				faculty: submitterMeta.faculty,
				programId: submitterMeta.programId,
				program: submitterMeta.program,
				createdAt,
				response: {
					modalidad:
						modalities[Math.floor(Math.random() * modalities.length)].modality,
					masculino,
					femenino,
					total,
				},
			});
		} else if (isGraduate) {
			responses.push({
				id: `mock-resp-${i}`,
				templateId: `7${templateSuffix}`,
				periodId,
				module: FormModules.graduate,
				submittedBy,
				facultyId: submitterMeta.facultyId,
				faculty: submitterMeta.faculty,
				programId: submitterMeta.programId,
				program: submitterMeta.program,
				createdAt,
				response: {
					modalidad:
						graduationModalities[
							Math.floor(Math.random() * graduationModalities.length)
						].name,
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
				templateId: `9${templateSuffix}`,
				periodId,
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
					carga_horaria:
						workloads[Math.floor(Math.random() * workloads.length)].name,
					categoria:
						teachingCategories[
							Math.floor(Math.random() * teachingCategories.length)
						].name,
					nivel_academico:
						teachingAcademicLevels[
							Math.floor(Math.random() * teachingAcademicLevels.length)
						].name,
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
				templateId: `10${templateSuffix}`,
				periodId,
				module: FormModules.scholarships,
				submittedBy,
				facultyId: submitterMeta.facultyId,
				faculty: submitterMeta.faculty,
				programId: submitterMeta.programId,
				program: submitterMeta.program,
				createdAt,
				response: {
					tipo: ["Parcial", "Completa"][Math.floor(Math.random() * 2)],
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

function generateMockResponseForTemplate(
	template: FormTemplateDef,
	index?: number,
) {
	const response: Record<string, any> = {};
	for (const field of template.fields) {
		if (field.type === "number") {
			if (field.name.toLowerCase() === "total") {
				continue;
			}
			response[field.name] = Math.floor(Math.random() * 50) + 5;
		} else if (
			field.type === "select" &&
			field.options &&
			field.options.length > 0
		) {
			const optIndex =
				index !== undefined
					? index % field.options.length
					: Math.floor(Math.random() * field.options.length);
			response[field.name] = field.options[optIndex].label;
		} else {
			response[field.name] = "Dato de prueba " + field.label;
		}
	}

	// Calculate total if there is a total field
	const totalField = template.fields.find(
		(f) =>
			f.name.toLowerCase() === "total" || f.label.toLowerCase() === "total",
	);
	if (totalField) {
		let sum = 0;
		for (const field of template.fields) {
			if (field.id !== totalField.id && field.type === "number") {
				sum += response[field.name] || 0;
			}
		}
		response[totalField.name] = sum;
	}

	return response;
}

export async function seedSpecificDirectorsData() {
	console.log(
		"🌱 Sembrando datos específicos para los 3 directores de prueba...",
	);

	const director1 = {
		email: "director1@uatf.edu.bo",
		facultyId: "E",
		faculty: "FAC. DE CC SS Y HH",
		programId: "TUU",
		program: "Turismo - Uyuni",
		completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
	};

	const director2 = {
		email: "director2@uatf.edu.bo",
		facultyId: "D",
		faculty: "FAC. DE CIENCIAS PURAS",
		programId: "EST",
		program: "Estadistica",
		completedSteps: [1, 2, 3, 4, 5, 6, 7],
	};

	const director3 = {
		email: "director3@uatf.edu.bo",
		facultyId: "C",
		faculty: "FAC. DE CC EE FF Y AA",
		programId: "CTT",
		program: "Contaduria Publica - Tupiza",
		completedSteps: [],
	};

	const specificDirectors = [director1, director2, director3];

	// Obtener todas las plantillas sembradas en 2026
	const templatesSnapshot = await db
		.collection("form_templates")
		.where("periodId", "==", "2026")
		.get();
	const templates: FormTemplateDef[] = [];
	templatesSnapshot.forEach((doc) => {
		templates.push(doc.data() as FormTemplateDef);
	});

	for (const director of specificDirectors) {
		// 1. Guardar el progreso del director
		await db.collection("director_progress").doc(director.email).set({
			completedSteps: director.completedSteps,
			periodId: "2026",
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		});

		// 2. Sembrar respuestas para las etapas completadas
		for (const step of director.completedSteps) {
			const template = templates.find((t) => t.step === step);
			if (!template) continue;

			// Decidir cantidad de respuestas a generar
			const count = template.hasBulk ? 3 : 1;
			for (let j = 0; j < count; j++) {
				const responseData = generateMockResponseForTemplate(template, j);
				const respId = `spec-resp-${director.programId}-${step}-${j}`;

				await db
					.collection(template.module)
					.doc(respId)
					.set({
						id: respId,
						templateId: template.id,
						periodId: "2026",
						module: template.module,
						submittedBy: director.email,
						facultyId: director.facultyId,
						faculty: director.faculty,
						programId: director.programId,
						program: director.program,
						createdAt:
							Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000),
						response: responseData,
					});
			}
		}
	}
	console.log("✅ Datos de directores específicos sembrados correctamente.");
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

export async function seedPeriods() {
	try {
		for (const item of periods) {
			await db
				.collection("periods")
				.doc(item.id)
				.set({
					...item,
					createdAt: new Date(),
					updatedAt: new Date(),
				});
		}
		console.log("✅ Periodos sembrados exitosamente");
	} catch (error) {
		console.error("❌ Error al sembrar periodos:", error);
	}
}

export async function runSeed() {
	console.log("🌱 Iniciando la siembra de datos en Firestore...");

	try {
		await seedPeriods();
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
		if (process.env.NODE_ENV !== "production") {
			await seedFormResponses();
			await seedSpecificDirectorsData();
		}

		console.log("🎉 Proceso de siembra finalizado con éxito.");
		process.exit(0);
	} catch (error) {
		console.error("❌ Ocurrió un error fatal durante el seed:", error);
		process.exit(1);
	}
}

runSeed();
