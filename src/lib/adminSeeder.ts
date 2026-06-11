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

let adminsFileToLoad = adminsFilePath;
if (!fs.existsSync(adminsFilePath)) {
	if (isProd) {
		console.error("❌ Error fatal: Falta el archivo 'admins.json' requerido para el entorno de producción.");
		process.exit(1);
	}
	console.log("ℹ️ No se encontró 'admins.json'. Usando 'admins.sample.json' para desarrollo.");
	adminsFileToLoad = adminsSamplePath;
}

const adminSeedUsers: Array<AdminType> = JSON.parse(
	fs.readFileSync(adminsFileToLoad, "utf-8"),
);

/**
 * @name Load Directors
 */
const directorsFilePath = path.resolve(__dirname, "lista_directores_2026_con_emails.json");
const directorsSamplePath = path.resolve(__dirname, "lista_directores_2026_con_emails.sample.json");

let directorsFileToLoad = directorsFilePath;
if (!fs.existsSync(directorsFilePath)) {
	if (isProd) {
		console.error("❌ Error fatal: Falta el archivo 'lista_directores_2026_con_emails.json' requerido para el entorno de producción.");
		process.exit(1);
	}
	console.log("ℹ️ No se encontró 'lista_directores_2026_con_emails.json'. Usando archivo de muestra para desarrollo.");
	directorsFileToLoad = directorsSamplePath;
}

const directors: Array<DirectorType> = JSON.parse(
	fs.readFileSync(directorsFileToLoad, "utf-8"),
);

async function CreateUser() {
	console.log("🚀 Starting seeders for user...");

	try {
		for (const director of directors) {
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
				createdAt: new Date().getTime(),
				updatedAt: new Date().getTime(),
			});
		}
	} catch (error) {
		console.log("🚀 Error creating user:", error);
		process.exit(1);
	}
}

async function createAdmin() {
	console.log("🚀 Starting seeders for admin...");

	try {
		for (const adminSeeder of adminSeedUsers) {
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
				createdAt: new Date().getTime(),
				updatedAt: new Date().getTime(),
			});
		}
	} catch (error) {
		console.log("🚀 Error creating admin:", error);
		process.exit(1);
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
