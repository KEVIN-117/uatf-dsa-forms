import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
	title: "UI/Button",
	component: Button,
	tags: ["autodocs"],
	args: {
		children: "Button",
		variant: "default",
		size: "default",
	},
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: {
		variant: "default",
		children: "Default Button",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		children: "Secondary Button",
	},
};

export const Destructive: Story = {
	args: {
		variant: "destructive",
		children: "Destructive Button",
	},
};

export const Outline: Story = {
	args: {
		variant: "outline",
		children: "Outline Button",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
		children: "Ghost Button",
	},
};

export const Link: Story = {
	args: {
		variant: "link",
		children: "Link Button",
	},
};
