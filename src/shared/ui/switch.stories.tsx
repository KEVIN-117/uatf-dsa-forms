import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Switch } from "./switch";

const meta: Meta<typeof Switch> = {
	title: "UI/Switch",
	component: Switch,
	tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof Switch> = {
	render: () => (
		<div className="flex items-center space-x-2">
			<Switch id="airplane-mode" />
			<Label htmlFor="airplane-mode">Airplane Mode</Label>
		</div>
	),
};
