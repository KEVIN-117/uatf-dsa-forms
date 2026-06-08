import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
	title: "UI/Textarea",
	component: Textarea,
	tags: ["autodocs"],
	args: {
		placeholder: "Type your message here.",
		disabled: false,
	},
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
	args: {
		placeholder: "Type your message here.",
	},
};

export const Disabled: Story = {
	args: {
		placeholder: "Textarea is disabled.",
		disabled: true,
	},
};
