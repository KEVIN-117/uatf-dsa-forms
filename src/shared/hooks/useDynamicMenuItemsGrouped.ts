import { useMemo } from "react";
import {
  FormModules,
  type FormResponseDef,
  type FormTemplateDef,
} from "../types/dynamic-form";
import { useFormTemplates } from "./useFormBuilder";
import {
  Bitcoin03Icon,
  Male02Icon,
  Quiz03Icon,
  StudentIcon,
  TeachingFreeIcons,
} from "@hugeicons/core-free-icons";
import { useAllResponses } from "./useFormResponses";

// Asumiendo que estos son tus hooks y types

// 1. Definimos las interfaces esperadas por el Sidebar
export interface MenuItem {
  id: string;
  name: string;
  icon: any;
  href: string;
}

export interface MenuItemGroup {
  id: string;
  name: string;
  icon: any;
  children: MenuItem[];
}

// 2. Diccionario de configuración visual por cada módulo
const MODULE_CONFIG: Record<
  FormModules,
  { name: string; icon: any; path: string }
> = {
  [FormModules.student]: {
    name: "Reporte de estudiantes",
    icon: Male02Icon,
    path: "student-report",
  },
  [FormModules.graduate]: {
    name: "Reporte de graduados",
    icon: StudentIcon,
    path: "graduates-report",
  },
  [FormModules.teacher]: {
    name: "Reporte docente",
    icon: TeachingFreeIcons,
    path: "teacher-report",
  },
  [FormModules.scholarships]: {
    name: "Reporte de becas",
    icon: Bitcoin03Icon,
    path: "scholarship-report",
  },
};

export const useDynamicMenuItemsGrouped = (): MenuItemGroup[] => {
  const templatesQuery = useFormTemplates();

  const menuGroups = useMemo(() => {
    if (!templatesQuery.data) return [];

    const groupedData = templatesQuery.data.reduce(
      (acc, template) => {
        const mod = template.module;
        if (!acc[mod]) {
          acc[mod] = [];
        }
        acc[mod].push(template);
        return acc;
      },
      {} as Record<FormModules, FormTemplateDef[]>,
    );

    const menuArray = Object.entries(groupedData).map(
      ([moduleKey, templates]) => {
        const moduleEnum = moduleKey as FormModules;
        const config = MODULE_CONFIG[moduleEnum];
        const childrenItems: MenuItem[] = templates.map((template) => ({
          id: template.id,
          name: template.title.replace(/_/g, " "),
          icon: Quiz03Icon,
          href: `/${config.path}/${template.id}`,
        }));

        // Retornamos el grupo estructurado
        return {
          id: config.path,
          name: config.name,
          icon: config.icon,
          children: childrenItems,
        } as MenuItemGroup;
      },
    );

    return menuArray;
  }, [templatesQuery.data]);

  return menuGroups;
};

export const useDynamicResultsMenuItemsGrouped = (): MenuItemGroup[] => {
  const templatesQuery = useAllResponses();
  const { data: allFormTemplates } = useFormTemplates();

  const menuGroups = useMemo(() => {
    if (!templatesQuery.data) return [];

    // Paso A: Agrupamos exactamente igual
    const groupedData = templatesQuery.data.reduce(
      (acc, response) => {
        const mod = response.module;
        if (!acc[mod]) acc[mod] = [];
        acc[mod].push(response);
        return acc;
      },
      {} as Record<FormModules, FormResponseDef[]>,
    );
    const menuArray = Object.entries(groupedData).map(
      ([moduleKey, templates]) => {
        const moduleEnum = moduleKey as FormModules;
        const config = MODULE_CONFIG[moduleEnum];
        const childrenItems: MenuItem[] = templates.map((template) => ({
          id: template.id,
          name:
            allFormTemplates?.find((t) => t.id === template.templateId)
              ?.title ?? "sin titulo",
          icon: Quiz03Icon,
          href: `/dashboard/reports/${template.id}/${moduleEnum}`,
        }));

        // Retornamos el grupo estructurado
        return {
          id: config.path,
          name: config.name,
          icon: config.icon,
          children: childrenItems,
        } as MenuItemGroup;
      },
    );
    return menuArray;
  }, [templatesQuery.data, allFormTemplates?.find]);

  return menuGroups;
};
