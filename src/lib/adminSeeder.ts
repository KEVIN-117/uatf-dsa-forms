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

interface AdminType extends UserType {}

/**
 * @name CreateUser
 * @description Create a user with the given data and return the user.
 */

const admin: Array<AdminType> = [
  {
    email: "admin@gmail.com",
    role: roles.ADMIN,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    name: "Admin",
  },
];

const directors: Array<DirectorType> = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "lista_directores_2026_con_emails.json"),
    "utf-8",
  ),
);

const admins: Array<AdminType> = [
  {
    email: "admin@gmail.com",
    role: roles.ADMIN,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    name: "Admin",
  },
];

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
    for (const admin of admins) {
      const createdUser = await auth.createUser({
        email: admin.email,
        password: "s40Oh2F#^iIBZ",
        displayName: admin.name,
      });
      const customClaim = {
        role: admin.role,
      };
      await auth.setCustomUserClaims(createdUser.uid, customClaim);
      console.log("🚀 Created admin:", createdUser.email);
      console.log("🚀 Custom claims:", customClaim);
      await db.collection("users").doc(createdUser.uid).set({
        name: admin.name,
        email: admin.email,
        role: admin.role,
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
