import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormContainer } from "./FormContainer";

const meta: Meta<typeof FormContainer> = {
	title: "Components/FormContainer",
	component: FormContainer,
};
export default meta;

export const Default: StoryObj<typeof FormContainer> = {
	args: {
		title: "UATF Registration Portal",
		description:
			"Welcome to the UATF registration module. Please complete all form inputs below.",
		children: (
			<div className="py-10 text-center text-sm border-2 border-dashed border-slate-600  rounded-xl">
				Form Content Component Area
			</div>
		),
	},
};
