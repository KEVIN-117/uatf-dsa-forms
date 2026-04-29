import type { Faculty, Program } from "#/shared/types";
import {
  FormModules,
  type FormResponseDef,
  type FormTemplateDef,
} from "../types/dynamic-form";
import { db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

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

const academicLevels: AcademicLevel[] = [
  {
    docId: "1",
    id: "1",
    name: "LICENCIATURA",
    code: "LIC",
  },
  {
    docId: "2",
    id: "2",
    name: "TECNICO SUPERIOR",
    code: "TEC. SUP.",
  },
  {
    docId: "3",
    id: "3",
    name: "TECNICO UNIVERSITARIO MEDIO",
    code: "TUM",
  },
];

const scholarshipsTypes: ScholarshipsType[] = [
  {
    docId: "1",
    id: "1",
    name: "BECA ALIMENTACION",
  },
  {
    docId: "2",
    id: "2",
    name: "BECA AUXILIAR DE DOCENCIA",
  },
  {
    docId: "3",
    id: "3",
    name: "BECA INVESTIGACION",
  },
  {
    docId: "4",
    id: "4",
    name: "BECA GRADUACION",
  },
  {
    docId: "5",
    id: "5",
    name: "BECA TRABAJO",
  },
];

const modalities: Modality[] = [
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

const faculties: Faculty[] = [
  {
    docId: "A",
    id: "A",
    name: "FACULTAD DE ARTES",
    code: "FAC. DE ARTES",
  },
  {
    docId: "B",
    id: "B",
    name: "FACULTAD DE CIENCIAS AGRICOLAS Y PECUARIAS",
    code: "FAC. DE CC. AA. Y P.P.",
  },
  {
    docId: "C",
    id: "C",
    name: "FACULTAD DE CIENCIAS ECONOMICAS FINANCIERAS Y ADMINISTRATIVAS",
    code: "FAC. DE CC. EE., FF. Y AA.",
  },
  {
    docId: "D",
    id: "D",
    name: "FACULTAD DE CIENCIAS PURAS",
    code: "FAC. DE CIENCIAS PURAS",
  },
  {
    docId: "E",
    id: "E",
    name: "FACULTAD DE CIENCIAS SOCIALES Y HUMANISTICAS",
    code: "FAC. DE CC. SS. Y HH.",
  },
  {
    docId: "F",
    id: "F",
    name: "FACULTAD DE DERECHO",
    code: "FAC. DE DERECHO",
  },
  {
    docId: "G",
    id: "G",
    name: "FACULTAD DE INGENIERIA",
    code: "FAC. DE INGENIERIA",
  },
  {
    docId: "H",
    id: "H",
    name: "FACULTAD DE INGENIERIA GEOLOGICA",
    code: "FAC. DE ING. GEOLOGICA",
  },
  {
    docId: "I",
    id: "I",
    name: "FACULTAD DE INGENIERIA MINERA",
    code: "FAC. DE ING. MINERA",
  },
  {
    docId: "J",
    id: "J",
    name: "FACULTAD DE INGENIERIA TECNOLOGICA",
    code: "FAC. DE ING. TECNOLOGICA",
  },
  {
    docId: "K",
    id: "K",
    name: "FACULTAD DE CIENCIAS DE LA SALUD",
    code: "FAC. DE CIENCIAS DE LA SALUD",
  },
  {
    docId: "L",
    id: "L",
    name: "FACULTAD DE MEDICINA",
    code: "FAC. DE MEDICINA",
  },
  {
    docId: "M",
    id: "M",
    name: "VICERRECTORADO",
    code: "VICERRECTORADO",
  },
];

const programs: Program[] = [
  // --- FACULTAD A: ARTES ---
  {
    docId: "APT",
    id: "APT",
    name: "ARTES PLASTICAS",
    code: "A11",
    facultyId: "A",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "ARM",
    id: "ARM",
    name: "ARTES MUSICALES",
    code: "A14",
    facultyId: "A",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "ARQ",
    id: "ARQ",
    name: "ARQUITECTURA",
    code: "A17",
    facultyId: "A",
    campusId: "1",
    level: "LIC",
  },

  // --- FACULTAD B: CIENCIAS AGRICOLAS Y PECUARIAS ---
  {
    docId: "AGR",
    id: "AGR",
    name: "INGENIERIA AGRONOMICA",
    code: "B11",
    facultyId: "B",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "IAI",
    id: "IAI",
    name: "INGENIERIA AGROINDUSTRIAL",
    code: "B13",
    facultyId: "B",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "IDR",
    id: "IDR",
    name: "INGENIERIA EN DESARROLLO RURAL",
    code: "B15",
    facultyId: "B",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "IDT",
    id: "IDT",
    name: "INGENIERIA EN DESARROLLO TERRITORIAL",
    code: "B16",
    facultyId: "B",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "VAG",
    id: "VAG",
    name: "INGENIERIA AGROPECUARIA - VILLAZON",
    code: "B17",
    facultyId: "B",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "MVZ",
    id: "MVZ",
    name: "MED. VETERINARIA Y ZOOTECNIA - TUPIZA",
    code: "B19",
    facultyId: "B",
    campusId: "1",
    level: "LIC",
  },

  // --- FACULTAD C: CIENCIAS ECONOMICAS FINANCIERAS Y ADMINISTRATIVAS ---
  {
    docId: "ADM",
    id: "ADM",
    name: "ADMINISTRACION DE EMPRESAS",
    code: "C11",
    facultyId: "C",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "COP",
    id: "COP",
    name: "AUDITORIA - CONTADURIA PUBLICA",
    code: "C13",
    facultyId: "C",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "TAS",
    id: "TAS",
    name: "TUS EN CONTABILIDAD",
    code: "C15",
    facultyId: "C",
    campusId: "1",
    level: "TUS",
  },
  {
    docId: "CTT",
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
    docId: "TST",
    id: "TST",
    name: "TUS EN CONTABILIDAD - TUPIZA",
    code: "C19",
    facultyId: "C",
    campusId: "1",
    level: "TUS",
  },
  {
    docId: "LAT",
    id: "LAT",
    name: "LICENCIATURA EN AUTORIA - TUPIZA",
    code: "C20",
    facultyId: "C",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "CTB",
    id: "CTB",
    name: "CONTABILIDAD Y FINANZAS",
    code: "C21",
    facultyId: "C",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "TSC",
    id: "TSC",
    name: "TUS. CONTADOR GENERAL",
    code: "C23",
    facultyId: "C",
    campusId: "1",
    level: "TUS",
  },
  {
    docId: "ECO",
    id: "ECO",
    name: "ECONOMIA",
    code: "C25",
    facultyId: "C",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "CEC",
    id: "CEC",
    name: "ECONOMIA - UNCIA",
    code: "C27",
    facultyId: "C",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "UEC",
    id: "UEC",
    name: "ECONOMIA - UYUNI",
    code: "C29",
    facultyId: "C",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "ICO",
    id: "ICO",
    name: "INGENIERIA COMERCIAL",
    code: "C31",
    facultyId: "C",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "VCI",
    id: "VCI",
    name: "COMERCIO INTERNACIONAL - VILLAZON",
    code: "C33",
    facultyId: "C",
    campusId: "1",
    level: "LIC",
  },

  // --- FACULTAD D: CIENCIAS PURAS ---
  {
    docId: "EST",
    id: "EST",
    name: "ESTADISTICA",
    code: "D11",
    facultyId: "D",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "FIS",
    id: "FIS",
    name: "FISICA",
    code: "D13",
    facultyId: "D",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "INF",
    id: "INF",
    name: "INGENIERIA INFORMATICA",
    code: "D15",
    facultyId: "D",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "TSR",
    id: "TSR",
    name: "ING. INFORMATICA - TECNICO SUPERIOR EN REDES Y CIBERSEGURIDAD",
    code: "D16",
    facultyId: "D",
    campusId: "1",
    level: "TUS",
  },
  {
    docId: "TSS",
    id: "TSS",
    name: "ING. INFORMATICA - TECNICO SUPERIOR EN SISTEMAS INFORMATICOS",
    code: "D17",
    facultyId: "D",
    campusId: "1",
    level: "TUS",
  },
  {
    docId: "CIN",
    id: "CIN",
    name: "PROGRAMA INGENIERIA INFORMATICA - UNCIA",
    code: "D18",
    facultyId: "D",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "MAT",
    id: "MAT",
    name: "MATEMATICA",
    code: "D19",
    facultyId: "D",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "QMC",
    id: "QMC",
    name: "QUIMICA",
    code: "D21",
    facultyId: "D",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "QUI",
    id: "QUI",
    name: "QUIMICA - UYUNI",
    code: "D3",
    facultyId: "D",
    campusId: "1",
    level: "LIC",
  },

  // --- FACULTAD E: CIENCIAS SOCIALES Y HUMANISTICAS ---
  {
    docId: "COM",
    id: "COM",
    name: "CIENCIAS DE LA COMUNICACION",
    code: "E11",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "LEI",
    id: "LEI",
    name: "LINGUISTICA E IDIOMAS",
    code: "E13",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "ULI",
    id: "ULI",
    name: "LINGUISTICA E IDIOMAS - UYUNI",
    code: "E15",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "CLI",
    id: "CLI",
    name: "PROGRAMA LINGUISTICA E IDIOMAS - UNCIA",
    code: "E17",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "TCS",
    id: "TCS",
    name: "TRABAJO SOCIAL",
    code: "E19",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "CTS",
    id: "CTS",
    name: "TRABAJO SOCIAL - UNCIA",
    code: "E21",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "TUR",
    id: "TUR",
    name: "TURISMO",
    code: "E23",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "TUU",
    id: "TUU",
    name: "TURISMO - UYUNI",
    code: "E25",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "EXQ",
    id: "EXQ",
    name: "EXTENSION LIBRE - QUECHUA",
    code: "E31",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "EXI",
    id: "EXI",
    name: "EXTENSION LIBRE - INGLES",
    code: "E32",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "EDI",
    id: "EDI",
    name: "ESCUELA DE IDIOMAS",
    code: "E33",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "EDT",
    id: "EDT",
    name: "ESCUELA DE IDIOMAS - TUPIZA",
    code: "E34",
    facultyId: "E",
    campusId: "1",
    level: "LIC",
  },

  // --- FACULTAD F: DERECHO ---
  {
    docId: "DER",
    id: "DER",
    name: "DERECHO",
    code: "F11",
    facultyId: "F",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "DET",
    id: "DET",
    name: "DERECHO - TUPIZA",
    code: "F13",
    facultyId: "F",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "CDE",
    id: "CDE",
    name: "DERECHO - UNCIA",
    code: "F15",
    facultyId: "F",
    campusId: "1",
    level: "LIC",
  },

  // --- FACULTAD G: INGENIERIA ---
  {
    docId: "CIV",
    id: "CIV",
    name: "INGENIERIA CIVIL",
    code: "G11",
    facultyId: "G",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "GYT",
    id: "GYT",
    name: "ING. EN GEODESIA Y TOPOGRAFIA",
    code: "G13",
    facultyId: "G",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "CCV",
    id: "CCV",
    name: "TUS. CONSTRUCCIONES CIVILES",
    code: "G15",
    facultyId: "G",
    campusId: "1",
    level: "TUS",
  },

  // --- FACULTAD H: INGENIERIA GEOLOGICA ---
  {
    docId: "IGO",
    id: "IGO",
    name: "INGENIERIA GEOLOGICA",
    code: "H11",
    facultyId: "H",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "IAM",
    id: "IAM",
    name: "INGENERIA AMBIENTAL",
    code: "H12",
    facultyId: "H",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "IMA",
    id: "IMA",
    name: "INGENIERIA DEL MEDIO AMBIENTE",
    code: "H13",
    facultyId: "H",
    campusId: "1",
    level: "LIC",
  },

  // --- FACULTAD I: INGENIERIA MINERA ---
  {
    docId: "IMI",
    id: "IMI",
    name: "INGENIERIA MINERA",
    code: "I11",
    facultyId: "I",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "MIN",
    id: "MIN",
    name: "INGENIERIA DE MINAS",
    code: "I12",
    facultyId: "I",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "PMM",
    id: "PMM",
    name: "ING. DE PROCESOS DE MAT. PRIMAS MIN.",
    code: "I13",
    facultyId: "I",
    campusId: "1",
    level: "LIC",
  },

  // --- FACULTAD J: INGENIERIA TECNOLOGICA ---
  {
    docId: "ELE",
    id: "ELE",
    name: "INGENIERIA ELECTRICA",
    code: "J11",
    facultyId: "J",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "TUE",
    id: "TUE",
    name: "TUS. ELECTRICIDAD",
    code: "J13",
    facultyId: "J",
    campusId: "1",
    level: "TUS",
  },
  {
    docId: "TED",
    id: "TED",
    name: "TEC. MEDIO ELECTRICIDAD",
    code: "J15",
    facultyId: "J",
    campusId: "1",
    level: "TUM",
  },
  {
    docId: "TSE",
    id: "TSE",
    name: "INGENIERIA ELECTRICA - SAN CRISTOBAL",
    code: "J16",
    facultyId: "J",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "IET",
    id: "IET",
    name: "INGENIERIA ELECTRONICA",
    code: "J17",
    facultyId: "J",
    campusId: "1",
    level: "LIC",
  },
  // Este es el segundo "TST". Recomiendo cambiar uno de los dos IDs si los usas como llaves primarias de Firestore.
  {
    docId: "TST_ELEC",
    id: "TST_ELEC",
    name: "TUS. ELECTRONICA",
    code: "J19",
    facultyId: "J",
    campusId: "1",
    level: "TUS",
  },
  {
    docId: "TEA",
    id: "TEA",
    name: "TEC. MEDIO ELECTRONICA",
    code: "J21",
    facultyId: "J",
    campusId: "1",
    level: "TUM",
  },
  {
    docId: "IND",
    id: "IND",
    name: "INGENIERIA INDUSTRIAL",
    code: "J22",
    facultyId: "J",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "IMC",
    id: "IMC",
    name: "INGENIERIA MECANICA",
    code: "J23",
    facultyId: "J",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "TUM",
    id: "TUM",
    name: "TUS. EN MECANICA GENERAL",
    code: "J25",
    facultyId: "J",
    campusId: "1",
    level: "TUS",
  },
  {
    docId: "TMG",
    id: "TMG",
    name: "TEC. MEDIO MECANICA GENERAL",
    code: "J27",
    facultyId: "J",
    campusId: "1",
    level: "TUM",
  },
  {
    docId: "TSM",
    id: "TSM",
    name: "INGENIERIA MECANICA - SAN CRISTOBAL",
    code: "J28",
    facultyId: "J",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "IMT",
    id: "IMT",
    name: "INGENIERIA MECATRONICA",
    code: "J29",
    facultyId: "J",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "TMC",
    id: "TMC",
    name: "TUS. EN MECATRONICA",
    code: "J31",
    facultyId: "J",
    campusId: "1",
    level: "TUS",
  },
  {
    docId: "MAU",
    id: "MAU",
    name: "TUS. EN MECANICA AUTOMOTRIZ",
    code: "J33",
    facultyId: "J",
    campusId: "1",
    level: "TUS",
  },
  {
    docId: "TMA",
    id: "TMA",
    name: "TEC. MEDIO MECANICA AUTOMOTRIZ",
    code: "J35",
    facultyId: "J",
    campusId: "1",
    level: "TUM",
  },
  {
    docId: "LMA",
    id: "LMA",
    name: "TEC. MEDIO MECANICA AUTOMOTRIZ - LLICA",
    code: "J36",
    facultyId: "J",
    campusId: "1",
    level: "TUM",
  },
  {
    docId: "TSA",
    id: "TSA",
    name: "TUS. EN MECANICA AUTOMOTRIZ - SAN CRISTOBAL",
    code: "J33",
    facultyId: "J",
    campusId: "1",
    level: "TUS",
  },

  // --- FACULTAD K: CIENCIAS DE LA SALUD ---
  {
    docId: "ENF",
    id: "ENF",
    name: "ENFERMERIA",
    code: "K11",
    facultyId: "K",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "TMF",
    id: "TMF",
    name: "TEC. MEDIO ENFERMERIA",
    code: "K12",
    facultyId: "K",
    campusId: "1",
    level: "TUM",
  },
  {
    docId: "PEN",
    id: "PEN",
    name: "PROG. DE AUXILIARES DE ENFERMERIA",
    code: "K13",
    facultyId: "K",
    campusId: "1",
    level: "TUM",
  },
  {
    docId: "LEF",
    id: "LEF",
    name: "TEC. MEDIO ENFERMERIA - LLICA",
    code: "K15",
    facultyId: "K",
    campusId: "1",
    level: "TUM",
  },
  {
    docId: "SEN",
    id: "SEN",
    name: "ENFERMERIA - SACACA",
    code: "K17",
    facultyId: "K",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "UEN",
    id: "UEN",
    name: "ENFERMERIA - UYUNI",
    code: "K19",
    facultyId: "K",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "UTE",
    id: "UTE",
    name: "TEC. MEDIO ENFERMERIA - UYUNI",
    code: "K21",
    facultyId: "K",
    campusId: "1",
    level: "TUM",
  },
  {
    docId: "VEF",
    id: "VEF",
    name: "ENFERMERIA - VILLAZON",
    code: "K23",
    facultyId: "K",
    campusId: "1",
    level: "LIC",
  },

  // --- FACULTAD L: MEDICINA ---
  {
    docId: "MED",
    id: "MED",
    name: "MEDICINA",
    code: "L11",
    facultyId: "L",
    campusId: "1",
    level: "LIC",
  },

  // --- FACULTAD M: VICERRECTORADO ---
  {
    docId: "SIS",
    id: "SIS",
    name: "INGENIERIA DE SISTEMAS",
    code: "M11",
    facultyId: "M",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "DPD",
    id: "DPD",
    name: "INGENIERIA EN DISEÑO Y PROGRAMACION DIGITAL",
    code: "M13",
    facultyId: "M",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "SIT",
    id: "SIT",
    name: "INGENIERIA DE SISTEMAS - TUPIZA",
    code: "M15",
    facultyId: "M",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "ODO",
    id: "ODO",
    name: "ODONTOLOGIA",
    code: "M17",
    facultyId: "M",
    campusId: "1",
    level: "LIC",
  },
  {
    docId: "PIC",
    id: "PIC",
    name: "PROGRAMA DE PEDAGOGIA INTERCULTURAL",
    code: "M19",
    facultyId: "M",
    campusId: "1",
    level: "LIC",
  },
];

const graduationModalities = [
  { id: "1", name: "TESIS DE GRADO", code: "TG" },
  { id: "2", name: "PROYECTO DE GRADO", code: "PG" },
  { id: "3", name: "TRABAJO DIRIGIDO", code: "TD" },
  { id: "4", name: "EXAMEN DE GRADO", code: "EG" },
  { id: "5", name: "INTERNADO ROTATORIO", code: "IR" },
  { id: "6", name: "ADSCRIPCION", code: "ADS" },
  { id: "7", name: "GRADUACION POR EXCELENCIA", code: "GE" },
  { id: "8", name: "MODALIDAD ESPECIAL DE TITULACION", code: "MET" },
  { id: "9", name: "DIPLOMADO DE GRADUACION", code: "DG" },
  { id: "10", name: "PRACTICA PROFESIONAL", code: "PP" },
];

export async function seedModalities() {
  try {
    for (const item of modalities) {
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
  try {
    for (const item of faculties) {
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
  try {
    const batchPromises = programs.map((item) =>
      setDoc(doc(db, "programs", item.id), {
        ...item,
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
      await setDoc(doc(db, "scholarshipsTypes", item.id), {
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
      await setDoc(doc(db, "academicLevels", item.id), {
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

export async function seedFormFields() {
  const studentFormTemplates: FormTemplateDef[] = [
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
          options: modalities.map((modality) => ({
            value: modality.id,
            label: modality.modality,
          })),
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
          options: modalities.map((modality) => ({
            value: modality.id,
            label: modality.modality,
          })),
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
      title: "Matricula estudiantes nuevos por sexo",
      description:
        "Este es el formulario de matricula estudiantes nuevos por sexo",
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
      id: "5",
      title: "Número de estudiantes programados por sexo",
      description:
        "Este es el formulario de número de estudiantes programados por sexo",
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
      id: "6",
      title:
        "Número de estudiantes aprobados, reprobados y abandonos de materias",
      description:
        "Este es el formulario de número de estudiantes aprobados, reprobados y abandonos de materias",
      module: FormModules.student,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "aprobados",
          label: "Aprobados",
          type: "number",
          required: true,
        },
        {
          id: "2",
          name: "reprobados",
          label: "Reprobados",
          type: "number",
          required: true,
        },
        {
          id: "3",
          name: "abandonos",
          label: "Abandonos",
          type: "number",
          required: false,
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

  const graduateFormTemplates: FormTemplateDef[] = [
    {
      id: "7",
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
          options: graduationModalities.map((modality) => ({
            value: modality.id,
            label: modality.name,
          })),
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
      id: "8",
      title: "Número de graduados por nivel académico y sexo",
      description:
        "Este es el formulario de número de graduados por nivel académico y sexo",
      module: FormModules.graduate,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "academic_level",
          label: "Nivel Académico",
          type: "select",
          required: true,
          options: academicLevels.map((level) => ({
            value: level.id,
            label: level.name,
          })),
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

  const teacherFormTemplates: FormTemplateDef[] = [
    {
      id: "9",
      title: "Número de docentes por nivel académico",
      description:
        "Este es el formulario de número de docentes por nivel académico",
      module: FormModules.teacher,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "paterno",
          label: "Apellido Paterno",
          type: "text",
          required: true,
        },
        {
          id: "2",
          name: "materno",
          label: "Apellido Materno",
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
          name: "ci",
          label: "Nro. Carnet",
          type: "text",
          required: true,
        },
        {
          id: "5",
          name: "cel",
          label: "Nro. Celular",
          type: "number",
          required: true,
        },
        {
          id: "6",
          name: "carga_horaria",
          label: "Carga Horaria",
          type: "number",
          required: true,
        },
        {
          id: "7",
          name: "categoria",
          label: "Categoría",
          type: "text",
          required: true,
        },
        {
          id: "8",
          name: "nivel_academico",
          label: "Nivel académico alcanzado",
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
  ];

  const scholarshipFormTemplates: FormTemplateDef[] = [
    {
      id: "10",
      title: "Número de beca alimentacion por tipo y sexo",
      description:
        "Este es el formulario de número de beca alimentacion por tipo y sexo",
      module: FormModules.scholarships,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "tipo",
          label: "Tipo",
          type: "select",
          required: true,
          options: scholarshipsTypes.map((scholarshipType) => ({
            value: scholarshipType.id,
            label: scholarshipType.name,
          })),
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
          required: true,
        },
      ],
    },
    {
      id: "11",
      title: "Número de auxiliares de docencia (Titulares y Invitados)",
      description: "Este es el formulario de número de auxiliares de docencia",
      module: FormModules.scholarships,
      isActive: true,
      fields: [
        {
          id: "1",
          name: "tipo",
          label: "Tipo",
          type: "select",
          required: true,
          options: [
            { value: "titulares", label: "Titulares" },
            { value: "invitados", label: "Invitados" },
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
          required: true,
        },
      ],
    },
    {
      id: "12",
      title: "Número de beca investigación",
      description: "Este es el formulario de número beca investigación",
      module: FormModules.scholarships,
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
          required: true,
        },
      ],
    },
    {
      id: "13",
      title: "Número de beca graduación",
      description: "Este es el formulario de número beca graduación",
      module: FormModules.scholarships,
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
          required: true,
        },
      ],
    },
    {
      id: "14",
      title: "Número de beca trabajo",
      description: "Este es el formulario de número beca trabajo",
      module: FormModules.scholarships,
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
          required: true,
        },
      ],
    },
  ];

  try {
    const batchPromisesStudents = studentFormTemplates.map((item) =>
      // Al usar doc(db, collection, ID) garantizamos que no se creen duplicados si corres el seed varias veces
      setDoc(doc(db, "form_templates", item.id), {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const batchPromisesGraduates = graduateFormTemplates.map((item) =>
      // Al usar doc(db, collection, ID) garantizamos que no se creen duplicados si corres el seed varias veces
      setDoc(doc(db, "form_templates", item.id), {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const batchPromisesTeachers = teacherFormTemplates.map((item) =>
      // Al usar doc(db, collection, ID) garantizamos que no se creen duplicados si corres el seed varias veces
      setDoc(doc(db, "form_templates", item.id), {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const batchPromisesScholarships = scholarshipFormTemplates.map((item) =>
      // Al usar doc(db, collection, ID) garantizamos que no se creen duplicados si corres el seed varias veces
      setDoc(doc(db, "form_templates", item.id), {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const templates = [
      ...studentFormTemplates,
      ...graduateFormTemplates,
      ...teacherFormTemplates,
      ...scholarshipFormTemplates,
    ];

    await Promise.all([
      batchPromisesStudents,
      batchPromisesGraduates,
      batchPromisesTeachers,
      batchPromisesScholarships,
    ]);
    console.log(`✅ ${templates.length} Form Templates sembrados exitosamente`);
  } catch (error) {
    console.error("❌ Error al sembrar los Form Templates:", error);
  }
}

export async function seedFormResponses() {
  console.log("🌱 Iniciando la siembra de datos en Firestore...");
  const responses: FormResponseDef[] = [];

  const modalities = [
    "Examen de Ingreso",
    "Curso Preuniversitario",
    "Ingreso Directo",
    "Excelencia Académica",
    "Traspaso",
  ];
  const scholarshipTypes = [
    "Beca Alimentación",
    "Beca Trabajo",
    "Beca Comedor",
    "Beca Excelencia",
    "Beca Deporte",
  ];
  const users = [
    "admin@uatf.edu.bo",
    "encargado@uatf.edu.bo",
    "registro@uatf.edu.bo",
    "usuario_prueba@uatf.edu.bo",
  ];

  // Generar 150 registros de prueba
  for (let i = 1; i <= 150; i++) {
    // Distribuir entre los 3 módulos principales
    const moduleType = i % 3;
    const isStudent = moduleType === 0;
    const isGraduate = moduleType === 1;

    const masculino = Math.floor(Math.random() * 5000) + 100;
    const femenino = Math.floor(Math.random() * 5000) + 100;
    const total = masculino + femenino;

    const submittedBy = users[Math.floor(Math.random() * users.length)];
    // Fecha aleatoria en los últimos 30 días
    const createdAt =
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);

    if (isStudent) {
      responses.push({
        id: `mock-resp-${i}`,
        templateId: "1",
        module: FormModules.student,
        submittedBy,
        createdAt,
        response: {
          modalidad: modalities[Math.floor(Math.random() * modalities.length)],
          masculino,
          femenino,
          total,
        },
      });
    } else if (isGraduate) {
      responses.push({
        id: `mock-resp-${i}`,
        templateId: "4",
        module: FormModules.graduate,
        submittedBy,
        createdAt,
        response: {
          modalidad: modalities[Math.floor(Math.random() * modalities.length)],
          masculino,
          femenino,
          total,
        },
      });
    } else {
      responses.push({
        id: `mock-resp-${i}`,
        templateId: "6",
        module: FormModules.scholarships,
        submittedBy,
        createdAt,
        response: {
          tipoBeca:
            scholarshipTypes[
              Math.floor(Math.random() * scholarshipTypes.length)
            ],
          masculino,
          femenino,
          total,
        },
      });
    }
  }

  try {
    // Procesar en lotes más pequeños si son muchos datos
    const batchSize = 50;
    for (let i = 0; i < responses.length; i += batchSize) {
      const batch = responses.slice(i, i + batchSize);
      const batchPromises = batch.map((item) =>
        setDoc(doc(db, item.module, item.id), item),
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
      await setDoc(doc(db, "graduation_modalities", item.id), {
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

export async function runSeed() {
  console.log("🌱 Iniciando la siembra de datos en Firestore...");

  try {
    await seedModalities();
    await seedGraduationModalities();
    await seedFaculties();
    await seedPrograms();
    await seedScholarshipsTypes();
    await seedFormFields();

    console.log("🎉 Proceso de siembra finalizado con éxito.");
    process.exit(0); // Detiene la ejecución del script limpiamente
  } catch (error) {
    console.error("❌ Ocurrió un error fatal durante el seed:", error);
    process.exit(1); // Detiene la ejecución indicando que hubo un error
  }
}

runSeed();
