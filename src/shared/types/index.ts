export interface Modality {
  docId: string;
  id: string;
  modality: string;
  code: string;
}

export interface Faculty {
  id: string; // id_facultad (A, B, C...)
  name: string; // facultad_completo
  code: string; // COD
}

export interface Program {
  id: string; // id_programa (APT, SIS, etc.)
  name: string; // programa
  code: string; // orden (ej: A11)
  facultyId: string; // Relación con Faculty
  campusId: string; // id_sede
  level: string; // LIC, TUS, TUM (del archivo fac_y_carreras)
}
