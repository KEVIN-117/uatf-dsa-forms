import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineLoader } from "./InlineLoader";

const meta: Meta<typeof InlineLoader> = {
	title: "Components/InlineLoader",
	component: InlineLoader,
	tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof InlineLoader> = {
	args: {
		text: "Cargando reportes...",
	},
};
