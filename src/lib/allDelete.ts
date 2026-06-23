// reset.js

import * as fs from "node:fs";
import * as path from "node:path";
import admin from "firebase-admin";

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

/**
 * 🔥 Vaciar todas las colecciones de Firestore
 */
async function deleteAllCollections() {
	const collections = await db.listCollections();
	for (const collection of collections) {
		const snapshot = await collection.get();
		const batch = db.batch();
		snapshot.docs.forEach((doc) => batch.delete(doc.ref));
		await batch.commit();
		console.log(`Colección ${collection.id} borrada`);
	}
}

/**
 * 👥 Vaciar todos los usuarios de Auth
 */
async function deleteAllUsers(nextPageToken?: string) {
	const result = await admin.auth().listUsers(1000, nextPageToken);
	const uids = result.users.map((user) => user.uid);

	if (uids.length > 0) {
		await admin.auth().deleteUsers(uids);
		console.log(`Eliminados ${uids.length} usuarios`);
	}

	if (result.pageToken) {
		// 🔁 seguir con la siguiente página
		await deleteAllUsers(result.pageToken);
	}
}

/**
 * 🚀 Ejecutar todo
 */
async function resetFirebase() {
	try {
		console.log("Borrando Firestore...");
		await deleteAllCollections();

		console.log("Borrando usuarios de Auth...");
		await deleteAllUsers();

		console.log("✅ Firebase vaciado por completo");
		process.exit(0);
	} catch (error) {
		console.error("Error al vaciar Firebase:", error);
		process.exit(1);
	}
}

resetFirebase();
