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
      ([moduleKey, responses]) => {
        const moduleEnum = moduleKey as FormModules;
        const config = MODULE_CONFIG[moduleEnum];

        const uniqueByTemplate = new Map<string, FormResponseDef>();
        for (const resp of responses) {
          if (!uniqueByTemplate.has(resp.templateId)) {
            uniqueByTemplate.set(resp.templateId, resp);
          }
        }

        const childrenItems: MenuItem[] = Array.from(
          uniqueByTemplate.values(),
        ).map((response) => ({
          id: response.templateId,
          name:
            allFormTemplates?.find((t) => t.id === response.templateId)
              ?.title ?? "sin titulo",
          icon: Quiz03Icon,
          href: `/dashboard/reports/${response.templateId}/${moduleEnum}`,
        }));

        return {
          id: config.path,
          name: config.name,
          icon: config.icon,
          children: childrenItems,
        } as MenuItemGroup;
      },
    );
    return menuArray;
  }, [templatesQuery.data, allFormTemplates]);

  return menuGroups;
};
