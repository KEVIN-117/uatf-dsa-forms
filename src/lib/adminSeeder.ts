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
const auth = admin.auth();

enum roles {
	ADMIN = "administrator",
	DIRECTOR = "director",
}

/**
 * @name UserType
 * @description
 */

type UserType = {
	email: string;
	role: roles;
	name: string;
	createdAt: number;
	updatedAt: number;
};

/**
 * @name Director type
 * @description
 */

interface DirectorType extends UserType {
	ci: string;
	paternalSurname: string;
	maternalSurname: string;
	facultyId: string;
	programId: string;
}

interface AdminType extends UserType {
	password: string;
}

const isProd = process.env.NODE_ENV === "production";

/**
 * @name Load Admins
 */
const adminsFilePath = path.resolve(__dirname, "admins.json");
const adminsSamplePath = path.resolve(__dirname, "admins.sample.json");

let adminsFileToLoad = adminsSamplePath;
if (isProd) {
	if (!fs.existsSync(adminsFilePath)) {
		console.error(
			"❌ Error fatal: Falta el archivo 'admins.json' requerido para el entorno de producción.",
		);
		process.exit(1);
	}
	adminsFileToLoad = adminsFilePath;
	console.log(
		"🚀 Cargando datos originales de administradores para producción...",
	);
} else {
	console.log("🌱 Cargando datos mock de administradores para desarrollo...");
}

const adminSeedUsers: Array<AdminType> = JSON.parse(
	fs.readFileSync(adminsFileToLoad, "utf-8"),
);

/**
 * @name Load Directors
 */
const directorsFilePath = path.resolve(
	__dirname,
	"lista_directores_2026_con_emails.json",
);
const directorsSamplePath = path.resolve(
	__dirname,
	"lista_directores_2026_con_emails.sample.json",
);

let directorsFileToLoad = directorsSamplePath;
if (isProd) {
	if (!fs.existsSync(directorsFilePath)) {
		console.error(
			"❌ Error fatal: Falta el archivo 'lista_directores_2026_con_emails.json' requerido para el entorno de producción.",
		);
		process.exit(1);
	}
	directorsFileToLoad = directorsFilePath;
	console.log("🚀 Cargando datos originales de directores para producción...");
} else {
	console.log("🌱 Cargando datos mock de directores para desarrollo...");
}

const directors: Array<DirectorType> = JSON.parse(
	fs.readFileSync(directorsFileToLoad, "utf-8"),
);

directors.push(
	{
		email: "director1@uatf.edu.bo",
		name: "Director Completo",
		ci: "1111111",
		paternalSurname: "Completo",
		maternalSurname: "Perez",
		facultyId: "E",
		faculty: "FAC. DE CC SS Y HH",
		programId: "TUU",
		program: "Turismo - Uyuni",
		role: roles.DIRECTOR,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	},
	{
		email: "director2@uatf.edu.bo",
		name: "Director Medio",
		ci: "2222222",
		paternalSurname: "Medio",
		maternalSurname: "Gomez",
		facultyId: "D",
		faculty: "FAC. DE CIENCIAS PURAS",
		programId: "EST",
		program: "Estadistica",
		role: roles.DIRECTOR,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	},
	{
		email: "director3@uatf.edu.bo",
		name: "Director Vacio",
		ci: "3333333",
		paternalSurname: "Vacio",
		maternalSurname: "Lopez",
		facultyId: "C",
		faculty: "FAC. DE CC EE FF Y AA",
		programId: "CTT",
		program: "Contaduria Publica - Tupiza",
		role: roles.DIRECTOR,
		createdAt: Date.now(),
		updatedAt: Date.now(),
	},
);

async function CreateUser() {
	console.log("🚀 Starting seeders for user...");

	for (const director of directors) {
		try {
			const createdUser = await auth.createUser({
				email: director.email,
				password: `${director.ci}@2026`,
				displayName: director.name,
			});
			const customClaim = {
				role: roles.DIRECTOR,
				facultyId: director.facultyId,
				programId: director.programId,
			};
			await auth.setCustomUserClaims(createdUser.uid, customClaim);
			console.log("🚀 Created user:", createdUser.email);
			console.log("🚀 Custom claims:", customClaim);
			await db.collection("users").doc(createdUser.uid).set({
				ci: director.ci,
				name: director.name,
				email: director.email,
				paternalSurname: director.paternalSurname,
				maternalSurname: director.maternalSurname,
				role: roles.DIRECTOR,
				facultyId: director.facultyId,
				programId: director.programId,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		} catch (error: any) {
			if (error.code === "auth/email-already-exists") {
				console.log(
					`ℹ️ El director ${director.email} ya existe. Actualizando claims y Firestore...`,
				);
				try {
					const existingUser = await auth.getUserByEmail(director.email);
					const customClaim = {
						role: roles.DIRECTOR,
						facultyId: director.facultyId,
						programId: director.programId,
					};
					await auth.setCustomUserClaims(existingUser.uid, customClaim);
					await db.collection("users").doc(existingUser.uid).set(
						{
							ci: director.ci,
							name: director.name,
							email: director.email,
							paternalSurname: director.paternalSurname,
							maternalSurname: director.maternalSurname,
							role: roles.DIRECTOR,
							facultyId: director.facultyId,
							programId: director.programId,
							updatedAt: Date.now(),
						},
						{ merge: true },
					);
				} catch (innerError) {
					console.error(
						`❌ Error al actualizar director existente ${director.email}:`,
						innerError,
					);
					process.exit(1);
				}
			} else {
				console.error(`❌ Error al crear director ${director.email}:`, error);
				process.exit(1);
			}
		}
	}
}

async function createAdmin() {
	console.log("🚀 Starting seeders for admin...");

	for (const adminSeeder of adminSeedUsers) {
		try {
			const createdUser = await auth.createUser({
				email: adminSeeder.email,
				password: adminSeeder.password,
				displayName: adminSeeder.name,
			});
			const customClaim = {
				role: adminSeeder.role,
			};
			await auth.setCustomUserClaims(createdUser.uid, customClaim);
			console.log("🚀 Created admin:", createdUser.email);
			console.log("🚀 Custom claims:", customClaim);
			await db.collection("users").doc(createdUser.uid).set({
				name: adminSeeder.name,
				email: adminSeeder.email,
				role: adminSeeder.role,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		} catch (error: any) {
			if (error.code === "auth/email-already-exists") {
				console.log(
					`ℹ️ El admin ${adminSeeder.email} ya existe. Actualizando claims y Firestore...`,
				);
				try {
					const existingUser = await auth.getUserByEmail(adminSeeder.email);
					const customClaim = {
						role: adminSeeder.role,
					};
					await auth.setCustomUserClaims(existingUser.uid, customClaim);
					await db.collection("users").doc(existingUser.uid).set(
						{
							name: adminSeeder.name,
							email: adminSeeder.email,
							role: adminSeeder.role,
							updatedAt: Date.now(),
						},
						{ merge: true },
					);
				} catch (innerError) {
					console.error(
						`❌ Error al actualizar admin existente ${adminSeeder.email}:`,
						innerError,
					);
					process.exit(1);
				}
			} else {
				console.error(`❌ Error al crear admin ${adminSeeder.email}:`, error);
				process.exit(1);
			}
		}
	}
}

async function seed() {
	try {
		await CreateUser();
		await createAdmin();
		console.log("🎉 Proceso de siembra finalizado con éxito.");
		process.exit(0);
	} catch (error) {
		console.log("🚀 Error seeding users:", error);
		process.exit(1);
	}
}

seed();
