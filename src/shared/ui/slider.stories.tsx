import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./slider";

const meta: Meta<typeof Slider> = {
	title: "UI/Slider",
	component: Slider,
	tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof Slider> = {
	args: {
		defaultValue: [50],
		max: 100,
		step: 1,
		className: "w-[60%]",
	},
};
