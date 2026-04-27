import type { Faculty, Program } from "#/shared/types";
import {
  FormModules,
  type FormResponseDef,
  type FormTemplateDef,
} from "../types/dynamic-form";
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

export async function seedFormFields() {
  const templates: FormTemplateDef[] = [
    {
      id: "1",
      title: "Numero de postulantes por modalidad y sexo",
      description:
        "Este es el formulario de numero de postulantes por modalidad y sexo",
      module: FormModules.student,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "modalidad",
          label: "Modalidad",
          type: "select",
          required: true,
          options: [
            { value: "1", label: "Curso de nivelación" },
            { value: "2", label: "CIM" },
            { value: "3", label: "Ingreso Directo" },
            { value: "4", label: "Pre-universitario" },
            { value: "5", label: "Reingreso" },
            { value: "6", label: "Traslado" },
            { value: "7", label: "Ingreso por Promoción" },
            { value: "8", label: "Ingreso por Convenio" },
            { value: "9", label: "Ingreso por Concurso" },
            { value: "10", label: "Ingreso por Excelencia" },
            { value: "11", label: "Ingreso por Mérito Deportivo" },
            { value: "12", label: "Ingreso por Mérito Artístico" },
          ],
        },
        {
          id: "2",
          name: "masculino",
          label: "Masculino",
          type: "number",
          required: true,
        },
        {
          id: "3",
          name: "femenino",
          label: "Femenino",
          type: "number",
          required: true,
        },
        {
          id: "4",
          name: "total",
          label: "Total",
          type: "number",
          required: false,
        },
      ],
    },
    {
      id: "2",
      title: "Número de postulantes admitidos por modalidad y sexo",
      description:
        "Este es el formulario de número de postulantes admitidos por modalidad y sexo",
      module: FormModules.student,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "modalidad",
          label: "Modalidad",
          type: "select",
          required: true,
          options: [
            { value: "1", label: "Curso de nivelación" },
            { value: "2", label: "CIM" },
            { value: "3", label: "Ingreso Directo" },
            { value: "4", label: "Pre-universitario" },
            { value: "5", label: "Reingreso" },
            { value: "6", label: "Traslado" },
            { value: "7", label: "Ingreso por Promoción" },
            { value: "8", label: "Ingreso por Convenio" },
            { value: "9", label: "Ingreso por Concurso" },
            { value: "10", label: "Ingreso por Excelencia" },
            { value: "11", label: "Ingreso por Mérito Deportivo" },
            { value: "12", label: "Ingreso por Mérito Artístico" },
          ],
        },
        {
          id: "2",
          name: "masculino",
          label: "Masculino",
          type: "number",
          required: true,
        },
        {
          id: "3",
          name: "femenino",
          label: "Femenino",
          type: "number",
          required: true,
        },
        {
          id: "4",
          name: "total",
          label: "Total",
          type: "number",
          required: false,
        },
      ],
    },
    {
      id: "3",
      title: "Matrícula estudiantil por sexo",
      description: "Este es el formulario de matrícula estudiantil por sexo",
      module: FormModules.student,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "masculino",
          label: "Masculino",
          type: "number",
          required: true,
        },
        {
          id: "2",
          name: "femenino",
          label: "Femenino",
          type: "number",
          required: true,
        },
        {
          id: "3",
          name: "total",
          label: "Total",
          type: "number",
          required: false,
        },
      ],
    },
    {
      id: "4",
      title: "Número de graduados por modalidad y sexo",
      description:
        "Este es el formulario de número de graduados por modalidad y sexo",
      module: FormModules.graduate,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "modalidad",
          label: "Modalidad",
          type: "select",
          required: true,
          options: [
            { value: "1", label: "Curso de nivelación" },
            { value: "2", label: "CIM" },
            { value: "3", label: "Ingreso Directo" },
            { value: "4", label: "Pre-universitario" },
            { value: "5", label: "Reingreso" },
            { value: "6", label: "Traslado" },
            { value: "7", label: "Ingreso por Promoción" },
            { value: "8", label: "Ingreso por Convenio" },
            { value: "9", label: "Ingreso por Concurso" },
            { value: "10", label: "Ingreso por Excelencia" },
            { value: "11", label: "Ingreso por Mérito Deportivo" },
            { value: "12", label: "Ingreso por Mérito Artístico" },
          ],
        },
        {
          id: "2",
          name: "masculino",
          label: "Masculino",
          type: "number",
          required: true,
        },
        {
          id: "3",
          name: "femenino",
          label: "Femenino",
          type: "number",
          required: true,
        },
        {
          id: "4",
          name: "total",
          label: "Total",
          type: "number",
          required: false,
        },
      ],
    },
    {
      id: "5",
      title: "Número de docentes",
      description: "Este es el formulario de número de docentes",
      module: FormModules.teacher,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "paterno",
          label: "Paterno",
          type: "text",
          required: true,
        },
        {
          id: "2",
          name: "materno",
          label: "Materno",
          type: "text",
          required: true,
        },
        {
          id: "3",
          name: "nombres",
          label: "Nombres",
          type: "text",
          required: true,
        },
        {
          id: "4",
          name: "carnet",
          label: "Número de carnet",
          type: "text",
          required: true,
        },
        {
          id: "5",
          name: "celular",
          label: "Numero de celular",
          type: "text",
          required: true,
        },
        {
          id: "6",
          name: "cargaHoraria",
          label: "Carga horaria",
          type: "number",
          required: true,
        },
        {
          id: "7",
          name: "categoria",
          label: "Categoria",
          type: "select",
          required: true,
          options: [
            { value: "1", label: "Tiempo Completo" },
            { value: "2", label: "Tiempo Parcial" },
            { value: "3", label: "Contratado" },
            { value: "4", label: "Honorarios" },
            { value: "5", label: "Asistente" },
            { value: "6", label: "Consultor" },
            { value: "7", label: "Interino" },
            { value: "8", label: "Ad Honorem" },
          ],
        },
        {
          id: "8",
          name: "nivelAcademico",
          label: "Nivel Academico Alcanzado",
          type: "text",
          required: true,
        },
        {
          id: "9",
          name: "profesion",
          label: "Profesión",
          type: "text",
          required: true,
        },
      ],
    },
    {
      id: "6",
      title: "Numero de beca alimentacion por tipo y sexo",
      description:
        "Este es el formulario de número de beca alimentacion por tipo y sexo",
      module: FormModules.scholarships,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "tipoBeca",
          label: "Tipo de beca",
          type: "select",
          required: true,
          options: [
            { value: "1", label: "Beca Alimentación" },
            { value: "2", label: "Beca Movilidad" },
            { value: "3", label: "Beca Excelencia" },
            { value: "4", label: "Beca Deportiva" },
            { value: "5", label: "Beca Artística" },
            { value: "6", label: "Beca Cultural" },
            { value: "7", label: "Beca de Investigación" },
            { value: "8", label: "Beca de Postgrado" },
            { value: "9", label: "Beca de Doctorado" },
            { value: "10", label: "Beca de Maestría" },
            { value: "11", label: "Beca de Intercambio" },
            { value: "12", label: "Beca de Solidaridad" },
          ],
        },
        {
          id: "2",
          name: "masculino",
          label: "Masculino",
          type: "number",
          required: true,
        },
        {
          id: "3",
          name: "femenino",
          label: "Femenino",
          type: "number",
          required: true,
        },
        {
          id: "4",
          name: "total",
          label: "Total",
          type: "number",
          required: false,
        },
      ],
    },
  ];

  try {
    const batchPromises = templates.map((item) =>
      // Al usar doc(db, collection, ID) garantizamos que no se creen duplicados si corres el seed varias veces
      setDoc(doc(db, "form_templates", item.id), {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await Promise.all(batchPromises);
    console.log(`✅ ${templates.length} Form Templates sembrados exitosamente`);
  } catch (error) {
    console.error("❌ Error al sembrar los Form Templates:", error);
  }
}

export async function seedFormResponses() {
  console.log("🌱 Iniciando la siembra de datos en Firestore...");
  const responses: FormResponseDef[] = [
    {
      id: "1",
      templateId: "1",
      module: FormModules.student,
      submittedBy: "user1",
      createdAt: Date.now(),
      response: {
        modalidad: "Interno",
        masculino: 4500,
        femenino: 5000,
        total: 9500,
      },
    },
    {
      id: "2",
      templateId: "4",
      module: FormModules.graduate,
      submittedBy: "user1",
      createdAt: Date.now(),
      response: {
        modalidad: "Interno",
        masculino: 4500,
        femenino: 5000,
        total: 9500,
      },
    },
    {
      id: "3",
      templateId: "6",
      module: FormModules.scholarships,
      submittedBy: "user1",
      createdAt: Date.now(),
      response: {
        tipoBeca: "Beca Alimentación",
        masculino: 4500,
        femenino: 5000,
        total: 9500,
      },
    },
  ];

  try {
    const batchPromises = responses.map((item) =>
      // Guardamos cada respuesta en la colección de su módulo (student, graduate, etc.)
      setDoc(doc(db, item.module, item.id), item),
    );

    await Promise.all(batchPromises);
    console.log(`✅ ${responses.length} Form Responses sembradas exitosamente`);
  } catch (error) {
    console.error("❌ Error al sembrar los Form Responses:", error);
  }
}

export async function runSeed() {
  console.log("🌱 Iniciando la siembra de datos en Firestore...");

  try {
    // Es recomendable ejecutarlos en orden si hay dependencias
    await seedModalities();
    await seedFaculties();
    await seedPrograms();
    await seedFormFields();
    await seedFormResponses();

    console.log("🎉 Proceso de siembra finalizado con éxito.");
    process.exit(0); // Detiene la ejecución del script limpiamente
  } catch (error) {
    console.error("❌ Ocurrió un error fatal durante el seed:", error);
    process.exit(1); // Detiene la ejecución indicando que hubo un error
  }
}
