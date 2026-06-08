import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";
import { Button } from "./button";
import { Toaster } from "./sonner";

const meta: Meta<typeof Toaster> = {
	title: "UI/Toaster",
	component: Toaster,
};
export default meta;

export const Default: StoryObj<typeof Toaster> = {
	render: () => (
		<div>
			<Toaster />
			<Button onClick={() => toast("Hello, this is a sonner toast!")}>
				Trigger Toast
			</Button>
		</div>
	),
};
