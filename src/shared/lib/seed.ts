import type { Faculty, Program } from "#/shared/types";
import { db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

interface Modality {
  id: string;
  modality: string;
  code: string;
}

export async function seedModalities() {
  const data: Modality[] = [
    {
      id: "1",
      modality: "EXAMEN P.S.A.",
      code: "PSA",
    },
    {
      id: "2",
      modality: "CURSO PRE - UNIVERSITARIO",
      code: "CPU",
    },
    {
      id: "3",
      modality: "INGRESO DIRECTO",
      code: "ID",
    },
    {
      id: "4",
      modality: "ADMISION POR EXCELENCIA ACADEMICA",
      code: "ADEA",
    },
    {
      id: "5",
      modality: "ADMISION EXTRAORDINARIA DEPORTIVA",
      code: "ADED",
    },
    {
      id: "6",
      modality: "ADMISION ESPECIAL (PROFESIONALES)",
      code: "AEP",
    },
    {
      id: "7",
      modality: "ADMISIÓN DIRECTA POR CONVENIO",
      code: "ADC",
    },
    {
      id: "8",
      modality: "ESTUDIOS SIMULTANEOS DE DOS CARRERAS",
      code: "ESC",
    },
    {
      id: "9",
      modality: "CAMBIO DE CARRERA",
      code: "CC",
    },
    {
      id: "10",
      modality: "ADMISION POR TRANSFERENCIA (SUB SEDES)",
      code: "APTSS",
    },
    {
      id: "11",
      modality: "ADMISION OLIMPIADAS CIENTIFICAS",
      code: "ADGOC",
    },
    {
      id: "12",
      modality: "ADMISION POR TRASPASO DE UNIVERSIDAD",
      code: "APTU",
    },
    {
      id: "13",
      modality: "ADMISION ESTUDIANTES INDIGENAS ORIGINARIOS CAMPESINOS",
      code: "ADEIOC",
    },
    {
      id: "14",
      modality: "ADMISION PERSONAS CON CAPACIDADES DIFERENTES O DISCAPACIDAD",
      code: "AEPD",
    },
    {
      id: "15",
      modality: "ADMISION ESPECIAL POR TRABAJO DE INVESTIGACION",
      code: "AEPTI",
    },
  ];

  try {
    for (const item of data) {
      await setDoc(doc(db, "modalities", item.id), {
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
  const data: Faculty[] = [
    {
      id: "A",
      name: "FACULTAD DE ARTES",
      code: "FAC. DE ARTES",
    },
    {
      id: "B",
      name: "FACULTAD DE CIENCIAS AGRICOLAS Y PECUARIAS",
      code: "FAC. DE CC. AA. Y P.P.",
    },
    {
      id: "C",
      name: "FACULTAD DE CIENCIAS ECONOMICAS FINANCIERAS Y ADMINISTRATIVAS",
      code: "FAC. DE CC. EE., FF. Y AA.",
    },
    {
      id: "D",
      name: "FACULTAD DE CIENCIAS PURAS",
      code: "FAC. DE CIENCIAS PURAS",
    },
    {
      id: "E",
      name: "FACULTAD DE CIENCIAS SOCIALES Y HUMANISTICAS",
      code: "FAC. DE CC. SS. Y HH.",
    },
    {
      id: "F",
      name: "FACULTAD DE DERECHO",
      code: "FAC. DE DERECHO",
    },
    {
      id: "G",
      name: "FACULTAD DE INGENIERIA",
      code: "FAC. DE INGENIERIA",
    },
    {
      id: "H",
      name: "FACULTAD DE INGENIERIA GEOLOGICA",
      code: "FAC. DE ING. GEOLOGICA",
    },
    {
      id: "I",
      name: "FACULTAD DE INGENIERIA MINERA",
      code: "FAC. DE ING. MINERA",
    },
    {
      id: "J",
      name: "FACULTAD DE INGENIERIA TECNOLOGICA",
      code: "FAC. DE ING. TECNOLOGICA",
    },
    {
      id: "K",
      name: "FACULTAD DE CIENCIAS DE LA SALUD",
      code: "FAC. DE CIENCIAS DE LA SALUD",
    },
    {
      id: "L",
      name: "FACULTAD DE MEDICINA",
      code: "FAC. DE MEDICINA",
    },
    {
      id: "M",
      name: "VICERRECTORADO",
      code: "VICERRECTORADO",
    },
  ];

  try {
    for (const item of data) {
      // Usamos setDoc con el ID manual para que sea predecible
      await setDoc(doc(db, "faculties", item.id), {
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
  const data: Program[] = [
    // --- FACULTAD A: ARTES ---
    {
      id: "APT",
      name: "ARTES PLASTICAS",
      code: "A11",
      facultyId: "A",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "ARM",
      name: "ARTES MUSICALES",
      code: "A14",
      facultyId: "A",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "ARQ",
      name: "ARQUITECTURA",
      code: "A17",
      facultyId: "A",
      campusId: "1",
      level: "LIC",
    },

    // --- FACULTAD B: CIENCIAS AGRICOLAS Y PECUARIAS ---
    {
      id: "AGR",
      name: "INGENIERIA AGRONOMICA",
      code: "B11",
      facultyId: "B",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "IAI",
      name: "INGENIERIA AGROINDUSTRIAL",
      code: "B13",
      facultyId: "B",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "IDR",
      name: "INGENIERIA EN DESARROLLO RURAL",
      code: "B15",
      facultyId: "B",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "IDT",
      name: "INGENIERIA EN DESARROLLO TERRITORIAL",
      code: "B16",
      facultyId: "B",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "VAG",
      name: "INGENIERIA AGROPECUARIA - VILLAZON",
      code: "B17",
      facultyId: "B",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "MVZ",
      name: "MED. VETERINARIA Y ZOOTECNIA - TUPIZA",
      code: "B19",
      facultyId: "B",
      campusId: "1",
      level: "LIC",
    },

    // --- FACULTAD C: CIENCIAS ECONOMICAS FINANCIERAS Y ADMINISTRATIVAS ---
    {
      id: "ADM",
      name: "ADMINISTRACION DE EMPRESAS",
      code: "C11",
      facultyId: "C",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "COP",
      name: "AUDITORIA - CONTADURIA PUBLICA",
      code: "C13",
      facultyId: "C",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "TAS",
      name: "TUS EN CONTABILIDAD",
      code: "C15",
      facultyId: "C",
      campusId: "1",
      level: "TUS",
    },
    {
      id: "CTT",
      name: "CONTADURIA PUBLICA - TUPIZA",
      code: "C17",
      facultyId: "C",
      campusId: "1",
      level: "LIC",
    },
    // Nota: El ID "TST" se repite más abajo en la Facultad J (Electrónica). En Firestore el ID debe ser único.
    // Te sugiero cambiar este a "TST_C" o similar si hay conflicto.
    {
      id: "TST",
      name: "TUS EN CONTABILIDAD - TUPIZA",
      code: "C19",
      facultyId: "C",
      campusId: "1",
      level: "TUS",
    },
    {
      id: "LAT",
      name: "LICENCIATURA EN AUTORIA - TUPIZA",
      code: "C20",
      facultyId: "C",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "CTB",
      name: "CONTABILIDAD Y FINANZAS",
      code: "C21",
      facultyId: "C",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "TSC",
      name: "TUS. CONTADOR GENERAL",
      code: "C23",
      facultyId: "C",
      campusId: "1",
      level: "TUS",
    },
    {
      id: "ECO",
      name: "ECONOMIA",
      code: "C25",
      facultyId: "C",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "CEC",
      name: "ECONOMIA - UNCIA",
      code: "C27",
      facultyId: "C",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "UEC",
      name: "ECONOMIA - UYUNI",
      code: "C29",
      facultyId: "C",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "ICO",
      name: "INGENIERIA COMERCIAL",
      code: "C31",
      facultyId: "C",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "VCI",
      name: "COMERCIO INTERNACIONAL - VILLAZON",
      code: "C33",
      facultyId: "C",
      campusId: "1",
      level: "LIC",
    },

    // --- FACULTAD D: CIENCIAS PURAS ---
    {
      id: "EST",
      name: "ESTADISTICA",
      code: "D11",
      facultyId: "D",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "FIS",
      name: "FISICA",
      code: "D13",
      facultyId: "D",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "INF",
      name: "INGENIERIA INFORMATICA",
      code: "D15",
      facultyId: "D",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "TSR",
      name: "ING. INFORMATICA - TECNICO SUPERIOR EN REDES Y CIBERSEGURIDAD",
      code: "D16",
      facultyId: "D",
      campusId: "1",
      level: "TUS",
    },
    {
      id: "TSS",
      name: "ING. INFORMATICA - TECNICO SUPERIOR EN SISTEMAS INFORMATICOS",
      code: "D17",
      facultyId: "D",
      campusId: "1",
      level: "TUS",
    },
    {
      id: "CIN",
      name: "PROGRAMA INGENIERIA INFORMATICA - UNCIA",
      code: "D18",
      facultyId: "D",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "MAT",
      name: "MATEMATICA",
      code: "D19",
      facultyId: "D",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "QMC",
      name: "QUIMICA",
      code: "D21",
      facultyId: "D",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "QUI",
      name: "QUIMICA - UYUNI",
      code: "D3",
      facultyId: "D",
      campusId: "1",
      level: "LIC",
    },

    // --- FACULTAD E: CIENCIAS SOCIALES Y HUMANISTICAS ---
    {
      id: "COM",
      name: "CIENCIAS DE LA COMUNICACION",
      code: "E11",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "LEI",
      name: "LINGUISTICA E IDIOMAS",
      code: "E13",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "ULI",
      name: "LINGUISTICA E IDIOMAS - UYUNI",
      code: "E15",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "CLI",
      name: "PROGRAMA LINGUISTICA E IDIOMAS - UNCIA",
      code: "E17",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "TCS",
      name: "TRABAJO SOCIAL",
      code: "E19",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "CTS",
      name: "TRABAJO SOCIAL - UNCIA",
      code: "E21",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "TUR",
      name: "TURISMO",
      code: "E23",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "TUU",
      name: "TURISMO - UYUNI",
      code: "E25",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "EXQ",
      name: "EXTENSION LIBRE - QUECHUA",
      code: "E31",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "EXI",
      name: "EXTENSION LIBRE - INGLES",
      code: "E32",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "EDI",
      name: "ESCUELA DE IDIOMAS",
      code: "E33",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "EDT",
      name: "ESCUELA DE IDIOMAS - TUPIZA",
      code: "E34",
      facultyId: "E",
      campusId: "1",
      level: "LIC",
    },

    // --- FACULTAD F: DERECHO ---
    {
      id: "DER",
      name: "DERECHO",
      code: "F11",
      facultyId: "F",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "DET",
      name: "DERECHO - TUPIZA",
      code: "F13",
      facultyId: "F",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "CDE",
      name: "DERECHO - UNCIA",
      code: "F15",
      facultyId: "F",
      campusId: "1",
      level: "LIC",
    },

    // --- FACULTAD G: INGENIERIA ---
    {
      id: "CIV",
      name: "INGENIERIA CIVIL",
      code: "G11",
      facultyId: "G",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "GYT",
      name: "ING. EN GEODESIA Y TOPOGRAFIA",
      code: "G13",
      facultyId: "G",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "CCV",
      name: "TUS. CONSTRUCCIONES CIVILES",
      code: "G15",
      facultyId: "G",
      campusId: "1",
      level: "TUS",
    },

    // --- FACULTAD H: INGENIERIA GEOLOGICA ---
    {
      id: "IGO",
      name: "INGENIERIA GEOLOGICA",
      code: "H11",
      facultyId: "H",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "IAM",
      name: "INGENERIA AMBIENTAL",
      code: "H12",
      facultyId: "H",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "IMA",
      name: "INGENIERIA DEL MEDIO AMBIENTE",
      code: "H13",
      facultyId: "H",
      campusId: "1",
      level: "LIC",
    },

    // --- FACULTAD I: INGENIERIA MINERA ---
    {
      id: "IMI",
      name: "INGENIERIA MINERA",
      code: "I11",
      facultyId: "I",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "MIN",
      name: "INGENIERIA DE MINAS",
      code: "I12",
      facultyId: "I",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "PMM",
      name: "ING. DE PROCESOS DE MAT. PRIMAS MIN.",
      code: "I13",
      facultyId: "I",
      campusId: "1",
      level: "LIC",
    },

    // --- FACULTAD J: INGENIERIA TECNOLOGICA ---
    {
      id: "ELE",
      name: "INGENIERIA ELECTRICA",
      code: "J11",
      facultyId: "J",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "TUE",
      name: "TUS. ELECTRICIDAD",
      code: "J13",
      facultyId: "J",
      campusId: "1",
      level: "TUS",
    },
    {
      id: "TED",
      name: "TEC. MEDIO ELECTRICIDAD",
      code: "J15",
      facultyId: "J",
      campusId: "1",
      level: "TUM",
    },
    {
      id: "TSE",
      name: "INGENIERIA ELECTRICA - SAN CRISTOBAL",
      code: "J16",
      facultyId: "J",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "IET",
      name: "INGENIERIA ELECTRONICA",
      code: "J17",
      facultyId: "J",
      campusId: "1",
      level: "LIC",
    },
    // Este es el segundo "TST". Recomiendo cambiar uno de los dos IDs si los usas como llaves primarias de Firestore.
    {
      id: "TST_ELEC",
      name: "TUS. ELECTRONICA",
      code: "J19",
      facultyId: "J",
      campusId: "1",
      level: "TUS",
    },
    {
      id: "TEA",
      name: "TEC. MEDIO ELECTRONICA",
      code: "J21",
      facultyId: "J",
      campusId: "1",
      level: "TUM",
    },
    {
      id: "IND",
      name: "INGENIERIA INDUSTRIAL",
      code: "J22",
      facultyId: "J",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "IMC",
      name: "INGENIERIA MECANICA",
      code: "J23",
      facultyId: "J",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "TUM",
      name: "TUS. EN MECANICA GENERAL",
      code: "J25",
      facultyId: "J",
      campusId: "1",
      level: "TUS",
    },
    {
      id: "TMG",
      name: "TEC. MEDIO MECANICA GENERAL",
      code: "J27",
      facultyId: "J",
      campusId: "1",
      level: "TUM",
    },
    {
      id: "TSM",
      name: "INGENIERIA MECANICA - SAN CRISTOBAL",
      code: "J28",
      facultyId: "J",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "IMT",
      name: "INGENIERIA MECATRONICA",
      code: "J29",
      facultyId: "J",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "TMC",
      name: "TUS. EN MECATRONICA",
      code: "J31",
      facultyId: "J",
      campusId: "1",
      level: "TUS",
    },
    {
      id: "MAU",
      name: "TUS. EN MECANICA AUTOMOTRIZ",
      code: "J33",
      facultyId: "J",
      campusId: "1",
      level: "TUS",
    },
    {
      id: "TMA",
      name: "TEC. MEDIO MECANICA AUTOMOTRIZ",
      code: "J35",
      facultyId: "J",
      campusId: "1",
      level: "TUM",
    },
    {
      id: "LMA",
      name: "TEC. MEDIO MECANICA AUTOMOTRIZ - LLICA",
      code: "J36",
      facultyId: "J",
      campusId: "1",
      level: "TUM",
    },
    {
      id: "TSA",
      name: "TUS. EN MECANICA AUTOMOTRIZ - SAN CRISTOBAL",
      code: "J33",
      facultyId: "J",
      campusId: "1",
      level: "TUS",
    },

    // --- FACULTAD K: CIENCIAS DE LA SALUD ---
    {
      id: "ENF",
      name: "ENFERMERIA",
      code: "K11",
      facultyId: "K",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "TMF",
      name: "TEC. MEDIO ENFERMERIA",
      code: "K12",
      facultyId: "K",
      campusId: "1",
      level: "TUM",
    },
    {
      id: "PEN",
      name: "PROG. DE AUXILIARES DE ENFERMERIA",
      code: "K13",
      facultyId: "K",
      campusId: "1",
      level: "TUM",
    },
    {
      id: "LEF",
      name: "TEC. MEDIO ENFERMERIA - LLICA",
      code: "K15",
      facultyId: "K",
      campusId: "1",
      level: "TUM",
    },
    {
      id: "SEN",
      name: "ENFERMERIA - SACACA",
      code: "K17",
      facultyId: "K",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "UEN",
      name: "ENFERMERIA - UYUNI",
      code: "K19",
      facultyId: "K",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "UTE",
      name: "TEC. MEDIO ENFERMERIA - UYUNI",
      code: "K21",
      facultyId: "K",
      campusId: "1",
      level: "TUM",
    },
    {
      id: "VEF",
      name: "ENFERMERIA - VILLAZON",
      code: "K23",
      facultyId: "K",
      campusId: "1",
      level: "LIC",
    },

    // --- FACULTAD L: MEDICINA ---
    {
      id: "MED",
      name: "MEDICINA",
      code: "L11",
      facultyId: "L",
      campusId: "1",
      level: "LIC",
    },

    // --- FACULTAD M: VICERRECTORADO ---
    {
      id: "SIS",
      name: "INGENIERIA DE SISTEMAS",
      code: "M11",
      facultyId: "M",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "DPD",
      name: "INGENIERIA EN DISEÑO Y PROGRAMACION DIGITAL",
      code: "M13",
      facultyId: "M",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "SIT",
      name: "INGENIERIA DE SISTEMAS - TUPIZA",
      code: "M15",
      facultyId: "M",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "ODO",
      name: "ODONTOLOGIA",
      code: "M17",
      facultyId: "M",
      campusId: "1",
      level: "LIC",
    },
    {
      id: "PIC",
      name: "PROGRAMA DE PEDAGOGIA INTERCULTURAL",
      code: "M19",
      facultyId: "M",
      campusId: "1",
      level: "LIC",
    },
  ];

  try {
    const batchPromises = data.map((item) =>
      // Al usar doc(db, collection, ID) garantizamos que no se creen duplicados si corres el seed varias veces
      setDoc(doc(db, "programs", item.id), {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await Promise.all(batchPromises);
    console.log(`✅ ${data.length} Programas sembrados exitosamente`);
  } catch (error) {
    console.error("❌ Error al sembrar los programas:", error);
  }
}

export async function runSeed() {
  console.log("🌱 Iniciando la siembra de datos en Firestore...");

  try {
    // Es recomendable ejecutarlos en orden si hay dependencias
    await seedModalities();
    await seedFaculties();
    await seedPrograms();

    console.log("🎉 Proceso de siembra finalizado con éxito.");
    process.exit(0); // Detiene la ejecución del script limpiamente
  } catch (error) {
    console.error("❌ Ocurrió un error fatal durante el seed:", error);
    process.exit(1); // Detiene la ejecución indicando que hubo un error
  }
}

