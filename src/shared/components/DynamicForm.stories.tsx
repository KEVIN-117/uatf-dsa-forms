import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { FormModules, type FormTemplateDef } from "#/shared/types/dynamic-form";
import { DynamicForm } from "./DynamicForm";

const meta: Meta<typeof DynamicForm> = {
	title: "Components/DynamicForm",
	component: DynamicForm,
};
export default meta;

const mockTemplate: FormTemplateDef = {
	id: "template-1",
	title: "Formulario de Admisiones",
	description:
		"Formulario para el registro de nuevos estudiantes en carreras oficiales.",
	module: FormModules.student,
	step: 1,
	isActive: true,
	hasBulk: false,
	fields: [
		{
			id: "f1",
			name: "nombre",
			label: "Full Name",
			type: "text",
			required: true,
		},
		{
			id: "f2",
			name: "email",
			label: "Email Address",
			type: "email",
			required: true,
		},
		{
			id: "f3",
			name: "telefono",
			label: "Phone Number",
			type: "text",
			required: false,
		},
	],
};

export const Default: StoryObj<typeof DynamicForm> = {
	render: () => {
		const [reset, setReset] = React.useState(false);
		return (
			<div className="border p-6 rounded-xl bg-card">
				<DynamicForm
					template={mockTemplate}
					onSubmit={async (data) => console.log("Form Submitted:", data)}
					resetForm={reset}
					setResetForm={setReset}
				/>
			</div>
		);
	},
};
