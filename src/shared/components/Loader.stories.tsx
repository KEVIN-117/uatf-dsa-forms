import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loader } from "./Loader";

const meta: Meta<typeof Loader> = {
	title: "Components/Loader",
	component: Loader,
};
export default meta;

export const Default: StoryObj<typeof Loader> = {
	args: {
		text: "Verificando sesión...",
	},
};
