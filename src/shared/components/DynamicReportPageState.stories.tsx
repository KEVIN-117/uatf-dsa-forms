import type { Meta, StoryObj } from "@storybook/react-vite";
import { DynamicReportPageState } from "./DynamicReportPageState";

const meta: Meta<typeof DynamicReportPageState> = {
	title: "Components/DynamicReportPageState",
	component: DynamicReportPageState,
};
export default meta;

export const Default: StoryObj<typeof DynamicReportPageState> = {
	args: {
		title: "Catalog Access Restrained",
		description:
			"You do not have the required administrative clearance levels to access or edit this catalog directory. Please contact the systems lead.",
	},
};
