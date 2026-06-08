import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
	title: "UI/Input",
	component: Input,
	tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Text: Story = {
	args: {
		type: "text",
		placeholder: "Enter text...",
	},
};

export const Email: Story = {
	args: {
		type: "email",
		placeholder: "Enter email...",
	},
};

export const Disabled: Story = {
	args: {
		type: "text",
		placeholder: "Disabled input",
		disabled: true,
	},
};
