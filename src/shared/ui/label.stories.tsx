import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta: Meta<typeof Label> = {
	title: "UI/Label",
	component: Label,
	tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof Label> = {
	render: () => (
		<div className="flex flex-col gap-2">
			<Label htmlFor="email">Your Email Address</Label>
			<Input id="email" type="email" placeholder="m@example.com" />
		</div>
	),
};
