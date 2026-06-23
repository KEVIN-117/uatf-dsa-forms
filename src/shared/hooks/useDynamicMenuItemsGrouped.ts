import {
	Bitcoin03Icon,
	Male02Icon,
	Quiz03Icon,
	StudentIcon,
	TeachingFreeIcons,
} from "@hugeicons/core-free-icons";
import { CheckCircle2, Lock } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import type { MenuItem, MenuItemGroup } from "#/shared/types";
import { useDirectorProgress } from "../../features/reports/hooks/useDirectorProgress";
import {
	FormModules,
	type FormResponseDef,
	type FormTemplateDef,
} from "../types/dynamic-form";
import { useFormTemplates } from "./useFormBuilder";
import { useAllResponses } from "./useFormResponses";

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
	const progressQuery = useDirectorProgress();
	const { userRole } = useAuth();
	const isDirector = userRole === "director";

	const menuGroups = useMemo(() => {
		if (!templatesQuery.data) return [];

		const completedSteps = isDirector
			? progressQuery.data?.completedSteps || []
			: [];
		const allSortedTemplates = [...templatesQuery.data].sort(
			(a, b) => a.step - b.step,
		);

		const nextaAvailableTemplate = allSortedTemplates.find(
			(t) => !completedSteps.includes(t.step),
		);

		const currentActiveStep = nextaAvailableTemplate
			? nextaAvailableTemplate.step
			: Infinity;

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
				const childrenItems: MenuItem[] = templates
					.sort((a, b) => a.step - b.step)
					.map((template) => {
						const isCompleted = isDirector
							? completedSteps.includes(template.step)
							: false;
						const isLocked = isDirector
							? !isCompleted && template.step > currentActiveStep
							: false;
						let statusIcon = CheckCircle2;
						if (isDirector && isLocked) statusIcon = Lock;
						if (!isDirector) statusIcon = config.icon;

						return {
							id: template.id,
							name: template.shortTitle || template.title.replace(/_/g, " "),
							icon: statusIcon,
							href: isLocked ? "#" : `/${config.path}/${template.id}`,
							isLocked,
							isCompleted,
						};
					});

				return {
					id: config.path,
					name: config.name,
					icon: config.icon,
					children: childrenItems,
				} as MenuItemGroup;
			},
		);

		return menuArray;
	}, [templatesQuery.data, progressQuery.data, isDirector]);

	return menuGroups;
};

export const useDynamicResultsMenuItemsGrouped = (): MenuItemGroup[] => {
	const templatesQuery = useFormTemplates();
	const progressQuery = useDirectorProgress();
	const { userRole } = useAuth();
	const isDirector = userRole === "director";

	const menuGroups = useMemo(() => {
		if (!templatesQuery.data) return [];

		const completedSteps = isDirector
			? progressQuery.data?.completedSteps || []
			: [];
		const allSortedTemplates = [...templatesQuery.data].sort(
			(a, b) => a.step - b.step,
		);

		const nextaAvailableTemplate = allSortedTemplates.find(
			(t) => !completedSteps.includes(t.step),
		);

		const currentActiveStep = nextaAvailableTemplate
			? nextaAvailableTemplate.step
			: Infinity;

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
				const childrenItems: MenuItem[] = templates
					.sort((a, b) => a.step - b.step)
					.map((template) => {
						const isCompleted = isDirector
							? completedSteps.includes(template.step)
							: false;
						const isLocked = isDirector
							? !isCompleted && template.step > currentActiveStep
							: false;
						let statusIcon = Quiz03Icon;
						if (isDirector && isLocked) statusIcon = Lock;
						if (isDirector && isCompleted) statusIcon = CheckCircle2;

						return {
							id: template.id,
							name: template.shortTitle || template.title.replace(/_/g, " "),
							icon: statusIcon,
							href: isLocked
								? "#"
								: `/dashboard/reports/${template.id}/${moduleEnum}`,
							isLocked,
							isCompleted,
						};
					});

				return {
					id: config.path,
					name: config.name,
					icon: config.icon,
					children: childrenItems,
				} as MenuItemGroup;
			},
		);

		return menuArray;
	}, [templatesQuery.data, progressQuery.data, isDirector]);

	return menuGroups;
};
