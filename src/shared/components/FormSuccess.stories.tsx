import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { FormModules } from "#/shared/types/dynamic-form";
import { FormSuccess } from "./FormSuccess";

const meta: Meta<typeof FormSuccess> = {
	title: "Components/FormSuccess",
	component: FormSuccess,
	decorators: [
		(Story) => {
			const rootRoute = createRootRoute({
				component: Story,
			});
			const router = createRouter({ routeTree: rootRoute });
			return <RouterProvider router={router} />;
		},
	],
};
export default meta;

export const Completion: StoryObj<typeof FormSuccess> = {
	args: {
		variant: "completion",
		directorName: "Dr. Roberto Gomez",
		faculty: "Facultad de Ingeniería",
		program: "Ingeniería de Sistemas",
		groups: [
			{
				template: {
					id: "template-1",
					title: "Reporte de Docentes",
					module: FormModules.teacher,
					step: 1,
					isActive: true,
					hasBulk: false,
					fields: [],
				},
				responses: [
					{
						id: "response-1",
						templateId: "template-1",
						module: FormModules.teacher,
						submittedBy: "roberto@example.com",
						facultyId: "fac-1",
						programId: "prog-1",
						faculty: "Facultad de Ingeniería",
						program: "Ingeniería de Sistemas",
						createdAt: Date.now(),
						response: { nombre: "Ing. Juan Perez", email: "juan@example.com" },
					},
				],
			},
		],
	},
};

export const Minimal: StoryObj<typeof FormSuccess> = {
	args: {
		variant: "minimal",
	},
};

export const Readonly: StoryObj<typeof FormSuccess> = {
	args: {
		variant: "readonly",
		directorName: "Dr. Roberto Gomez",
		faculty: "Facultad de Ingeniería",
		program: "Ingeniería de Sistemas",
		groups: [
			{
				template: {
					id: "template-1",
					title: "Reporte de Docentes",
					module: FormModules.teacher,
					step: 1,
					isActive: true,
					hasBulk: false,
					fields: [],
				},
				responses: [
					{
						id: "response-1",
						templateId: "template-1",
						module: FormModules.teacher,
						submittedBy: "roberto@example.com",
						facultyId: "fac-1",
						programId: "prog-1",
						faculty: "Facultad de Ingeniería",
						program: "Ingeniería de Sistemas",
						createdAt: Date.now(),
						response: { nombre: "Ing. Juan Perez", email: "juan@example.com" },
					},
				],
			},
		],
	},
};
