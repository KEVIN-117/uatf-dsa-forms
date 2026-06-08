import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutDashboard, Plus } from "lucide-react";
import { PageHeader } from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
	title: "Components/PageHeader",
	component: PageHeader,
	tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof PageHeader> = {
	args: {
		title: "Catalog Dashboard",
		description:
			"Manage reference catalogs, university departments, faculties, and enrollment modalities.",
		icon: LayoutDashboard,
	},
};

export const WithAction: StoryObj<typeof PageHeader> = {
	args: {
		title: "Programs Catalog",
		description:
			"View and edit list of authorized career paths and specialized degrees.",
		icon: LayoutDashboard,
		action: {
			label: "Add New Program",
			icon: Plus,
			onClick: () => console.log("Add clicked"),
		},
	},
};
