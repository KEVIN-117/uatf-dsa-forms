export interface Modality {
  docId: string;
  id: string;
  modality: string;
  code: string;
}

export interface GraduationModality {
  docId: string;
  id: string;
  name: string;
  code: string;
}

export interface Faculty {
  docId: string;
  id: string; // id_facultad (A, B, C...)
  name: string; // facultad_completo
  code: string; // COD
}

export interface Program {
  docId: string;
  id: string; // id_programa (APT, SIS, etc.)
  name: string; // programa
  code: string; // orden (ej: A11)
  facultyId: string; // Relación con Faculty
  campusId: string; // id_sede
  level: string; // LIC, TUS, TUM (del archivo fac_y_carreras)
}

export type IconSvgObject =
  | [
      string,
      {
        [key: string]: string | number;
      },
    ][]
  | readonly (readonly [
      string,
      {
        readonly [key: string]: string | number;
      },
    ])[];

export type MenuItem = {
  id: string;
  name: string;
  icon: IconSvgObject;
  href: string;
};

export type MenuItemGroup = {
  id: string;
  name: string;
  icon: IconSvgObject;
  children: MenuItem[];
};
