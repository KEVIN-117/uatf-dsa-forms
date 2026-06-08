import type { Meta, StoryObj } from "@storybook/react-vite";
import { DynamicReportPageSkeleton } from "./DynamicReportPageSkeleton";

const meta: Meta<typeof DynamicReportPageSkeleton> = {
	title: "Components/DynamicReportPageSkeleton",
	component: DynamicReportPageSkeleton,
};
export default meta;

export const Default: StoryObj<typeof DynamicReportPageSkeleton> = {
	args: {},
};
