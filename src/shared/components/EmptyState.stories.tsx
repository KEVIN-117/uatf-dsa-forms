import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileSearch } from "lucide-react";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
	title: "Components/EmptyState",
	component: EmptyState,
	tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof EmptyState> = {
	args: {
		title: "No submissions found",
		description:
			"There are currently no reports submitted for this graduation module.",
	},
};

export const WithAction: StoryObj<typeof EmptyState> = {
	args: {
		icon: FileSearch,
		title: "No search results match",
		description:
			"Try adjusting your query filter keywords or category tags to find what you are looking for.",
		action: {
			label: "Clear Search Filters",
			onClick: () => console.log("Cleared filters"),
		},
	},
};
